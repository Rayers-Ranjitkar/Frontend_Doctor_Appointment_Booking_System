import { useEffect, useMemo, useState } from 'react';
import { Bot, Send, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useClinic } from '@/context/ClinicContext';
import { apiRequest } from '@/utils/api';

type AssistantPayload = {
  summary: string;
  suggestions: string[];
  recommendedDoctorId: string | null;
  action?: 'answer_question' | 'recommend_doctor';
};

type ChatMessage = {
  role: 'assistant' | 'user';
  text: string;
  assistant?: AssistantPayload | null;
};

type ChatThread = {
  id: string;
  title: string;
  updatedAt?: string;
};

export default function PatientAssistant() {
  const navigate = useNavigate();
  const { doctors, backendConnected } = useClinic();
  const [prompt, setPrompt] = useState('');
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const initialAssistantMessage = useMemo<ChatMessage>(() => ({
    role: 'assistant',
    text: 'Ask about hospital FAQs, timings, departments, services, or tell me your symptom and I will suggest the right department and doctor.',
    assistant: null,
  }), []);

  useEffect(() => {
    // Load persisted chat history when backend is available.
    if (!backendConnected) {
      setMessages([initialAssistantMessage]);
      setSuggestions([]);
      setActiveThreadId(null);
      return;
    }

    void (async () => {
      try {
        const threadList = await loadThreadList();

        if (!threadList.length) {
          setActiveThreadId(null);
          setMessages([initialAssistantMessage]);
          setSuggestions([]);
          return;
        }

        const newest = threadList[0];
        setActiveThreadId(newest.id);

        const loaded = await apiRequest<{ messages: Array<{ role: 'assistant' | 'user'; text: string; assistant?: AssistantPayload | null }> }>(
          `/assistant/chats/${newest.id}/messages`,
          { method: 'GET' },
        );

        const mapped = (loaded.messages || []).map((m): ChatMessage => {
          if (m.role === 'assistant' && m.assistant) {
            const autoDoctorChip = m.assistant.recommendedDoctorId
              ? doctors.find((d) => d.id === m.assistant!.recommendedDoctorId)?.name ?? null
              : null;
            const mergedSuggestions = autoDoctorChip
              ? [autoDoctorChip, ...m.assistant.suggestions.filter((s) => s !== autoDoctorChip)].slice(0, 4)
              : m.assistant.suggestions;
            return {
              role: 'assistant',
              text: `${m.assistant.summary}${mergedSuggestions.length ? ` Suggested: ${mergedSuggestions.join(', ')}.` : ''}`,
              assistant: m.assistant,
            };
          }

          return { role: m.role, text: m.text, assistant: null };
        });
        setMessages(mapped.length ? mapped : [initialAssistantMessage]);

        const lastAssistant = [...(loaded.messages || [])].reverse().find((m) => m.role === 'assistant' && m.assistant)?.assistant;
        if (lastAssistant) {
          const autoDoctorChip = lastAssistant.recommendedDoctorId
            ? doctors.find((d) => d.id === lastAssistant.recommendedDoctorId)?.name ?? null
            : null;
          const mergedSuggestions = autoDoctorChip
            ? [autoDoctorChip, ...lastAssistant.suggestions.filter((s) => s !== autoDoctorChip)].slice(0, 4)
            : lastAssistant.suggestions;
          setSuggestions(mergedSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch {
        // If API fails, fall back to showing a fresh non-persistent chat view.
        setThreads([]);
        setActiveThreadId(null);
        setMessages([initialAssistantMessage]);
        setSuggestions([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendConnected]);

  const mergeAssistantSuggestions = (assistant: AssistantPayload): string[] => {
    const autoDoctorChip = assistant.recommendedDoctorId
      ? doctors.find((d) => d.id === assistant.recommendedDoctorId)?.name ?? null
      : null;

    return autoDoctorChip
      ? [autoDoctorChip, ...assistant.suggestions.filter((s) => s !== autoDoctorChip)].slice(0, 4)
      : assistant.suggestions;
  };

  const assistantDisplayText = (assistant: AssistantPayload): string => {
    const mergedSuggestions = mergeAssistantSuggestions(assistant);
    return `${assistant.summary}${mergedSuggestions.length ? ` Suggested: ${mergedSuggestions.join(', ')}.` : ''}`;
  };

  const loadThreadList = async () => {
    const result = await apiRequest<{ threads: ChatThread[] }>('/assistant/chats', { method: 'GET' });
    setThreads(result.threads || []);
    return result.threads || [];
  };

  const createNewThread = async () => {
    const result = await apiRequest<{ id: string; title: string }>('/assistant/chats', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    setActiveThreadId(result.id);
    setMessages([initialAssistantMessage]);
    setSuggestions([]);

    // Refresh list quickly in background (best-effort).
    try {
      await loadThreadList();
    } catch {
      // ignore
    }

    return result.id;
  };

  const submit = async (messageText?: string) => {
    const userPrompt = (messageText ?? prompt).trim();
    if (!userPrompt) return;

    // If no thread exists yet, create one first so it persists.
    let currentThreadId = activeThreadId;
    if (!currentThreadId) {
      currentThreadId = await createNewThread();
    }
    if (!currentThreadId) return;

    setMessages((current) => [...current, { role: 'user', text: userPrompt, assistant: null }]);
    setPrompt('');

    const reply = await apiRequest<AssistantPayload>(`/assistant/chats/${currentThreadId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ prompt: userPrompt }),
    });

    const mergedSuggestions = mergeAssistantSuggestions(reply);
    setSuggestions(mergedSuggestions);

    setMessages((current) => [
      ...current,
      { role: 'assistant', text: assistantDisplayText(reply), assistant: reply },
    ]);

    // Best-effort refresh so thread titles/ordering reflect the newest chat.
    try {
      await loadThreadList();
    } catch {
      // ignore
    }
  };

  const onSelectThread = async (threadId: string) => {
    setActiveThreadId(threadId);
    setSuggestions([]);

    try {
      const loaded = await apiRequest<{ messages: Array<{ role: 'assistant' | 'user'; text: string; assistant?: AssistantPayload | null }> }>(
        `/assistant/chats/${threadId}/messages`,
        { method: 'GET' },
      );

      const mapped = (loaded.messages || []).map((m): ChatMessage => {
        if (m.role === 'assistant' && m.assistant) {
          return { role: 'assistant', text: assistantDisplayText(m.assistant), assistant: m.assistant };
        }

        return { role: m.role, text: m.text, assistant: null };
      });

      setMessages(mapped.length ? mapped : [initialAssistantMessage]);

      const lastAssistant = [...(loaded.messages || [])].reverse().find((m) => m.role === 'assistant' && m.assistant)?.assistant;
      if (lastAssistant) setSuggestions(mergeAssistantSuggestions(lastAssistant));
    } catch {
      setMessages([initialAssistantMessage]);
      setSuggestions([]);
    }
  };

  const deleteCurrentThread = async () => {
    if (!activeThreadId) return;

    await apiRequest(`/assistant/chats/${activeThreadId}`, { method: 'DELETE' });

    const remainingThreads = await loadThreadList();
    if (!remainingThreads.length) {
      setActiveThreadId(null);
      setMessages([initialAssistantMessage]);
      setSuggestions([]);
      return;
    }

    await onSelectThread(remainingThreads[0].id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>AI Assistant</h1>
        <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Hospital Q&A, doctor guidance, and AI-assisted appointment booking.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Bot size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-gray-900" style={{ fontWeight: 700 }}>MediBook AI</p>
            <p className="text-gray-400" style={{ fontSize: '0.78rem' }}>Norvic Hospital FAQ and doctor guidance assistant</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {threads.length ? (
              <select
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none"
                value={activeThreadId ?? ''}
                onChange={(e) => void onSelectThread(e.target.value)}
                style={{ fontSize: '0.8rem', fontWeight: 600 }}
              >
                {threads.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title || 'Chat'}
                  </option>
                ))}
              </select>
            ) : null}

            <button
              onClick={() => void createNewThread()}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              style={{ fontWeight: 700, fontSize: '0.8rem' }}
            >
              New chat
            </button>
            <button
              onClick={() => void deleteCurrentThread()}
              disabled={!activeThreadId}
              className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontWeight: 700, fontSize: '0.8rem' }}
              title="Delete current chat"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4 min-h-[320px] bg-gray-50">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl px-4 py-3 rounded-2xl ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-100'}`} style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                {message.text.split('\n').map((line, i) => {
                  const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  if (line.startsWith('- ')) return <div key={i} className="flex gap-2 mt-0.5"><span className="text-blue-400 mt-1">•</span><span dangerouslySetInnerHTML={{ __html: bold.slice(2) }} /></div>;
                  if (bold !== line) return <p key={i} className="font-semibold mt-3 text-gray-900" dangerouslySetInnerHTML={{ __html: bold }} />;
                  if (line.trim() === '') return <div key={i} className="h-1" />;
                  return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} />;
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void submit();
              }
            }}
            placeholder="Ask a hospital question or tell me your symptom"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-400"
          />
          <button onClick={() => void submit()} className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center gap-2" style={{ fontWeight: 600 }}>
            <Send size={16} /> Ask
          </button>
        </div>
        {suggestions.length > 0 ? (
          <div className="px-5 pb-5 flex flex-wrap gap-2 bg-white">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  if (suggestion.startsWith('Dr. ')) {
                    const doctor = suggestion.toLowerCase().replace(/\./g, '').replace(/\s+/g, '-');
                    const target = doctor.includes('james-wilson') ? '/patient/book/d1' : doctor.includes('sarah-chen') ? '/patient/book/d2' : doctor.includes('emily-rodriguez') ? '/patient/book/d3' : '';
                    if (target) {
                      navigate(target);
                      return;
                    }
                  }
                  void submit(suggestion);
                }}
                className="px-3 py-2 rounded-full border border-blue-100 bg-blue-50 text-blue-700"
                style={{ fontSize: '0.8rem', fontWeight: 600 }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
