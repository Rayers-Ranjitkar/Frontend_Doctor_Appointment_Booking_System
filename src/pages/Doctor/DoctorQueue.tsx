import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, Users } from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { filterQueueEntriesForToday, todayLocalYMD } from '@/utils/calendarDate';
import React from 'react';

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  waiting: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Waiting' },
  in_consultation: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In consultation' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
};

export default function DoctorQueue() {
  const { queueEntries, currentDoctor, appointments, updateQueueEntry, fetchQueue } = useClinic();
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    void fetchQueue();
  }, [fetchQueue]);

  const { active, completed } = useMemo(() => {
    const today = todayLocalYMD();
    const todayQueues = filterQueueEntriesForToday(queueEntries, appointments, today);
    const mine = todayQueues
      .filter((entry) => entry.doctorId === currentDoctor.id)
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    const activeEntries = mine.filter((e) => e.status === 'waiting' || e.status === 'in_consultation');
    const completedEntries = mine.filter((e) => e.status === 'completed');

    return { active: activeEntries, completed: completedEntries };
  }, [queueEntries, currentDoctor.id, appointments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Today's Queue</h1>
          <p className="text-gray-500 flex items-center gap-2" style={{ fontSize: '0.9rem' }}>
            Manage patient flow and track consultations.
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
              {active.length} active
            </span>
          </p>
        </div>
        <button
          onClick={() => void fetchQueue()}
          className="self-start flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
          style={{ fontWeight: 600 }}
        >
          <Users size={18} /> Refresh Queue
        </button>
      </div>

      {active.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Users size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No patients in queue today.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {active.map((entry) => {
            const sc = statusConfig[entry.status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: entry.status };
            return (
              <div key={entry.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-600" style={{ fontWeight: 800, fontSize: '1.4rem' }}>{entry.position}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                      <h3 className="text-gray-900 truncate" style={{ fontWeight: 700, fontSize: '1rem' }}>{entry.patientName}</h3>
                      <span className={`px-3 py-1 rounded-full ${sc.bg} ${sc.text}`} style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        {sc.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <span className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: '0.82rem' }}>
                        <Clock size={13} /> ~{entry.estimatedWaitMinutes} mins
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-4 flex gap-2 flex-wrap">
                  {entry.status === 'waiting' && (
                    <button
                      onClick={() => void updateQueueEntry(entry.id, { status: 'in_consultation' })}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                      style={{ fontSize: '0.82rem', fontWeight: 600 }}
                    >
                      Start Consultation
                    </button>
                  )}

                  {entry.status === 'in_consultation' && (
                    <button
                      onClick={() => {
                        const createdAt = (entry as unknown as { createdAt?: string }).createdAt;
                        const actualWaitMinutes = createdAt
                          ? Math.round((Date.now() - new Date(createdAt).getTime()) / 60000)
                          : 0;
                        void updateQueueEntry(entry.id, { status: 'completed', actualWaitMinutes });
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                      style={{ fontSize: '0.82rem', fontWeight: 700 }}
                    >
                      <CheckCircle2 size={16} /> Mark Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowCompleted((v) => !v)}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div>
            <p className="text-gray-900" style={{ fontWeight: 700, fontSize: '1rem' }}>Completed</p>
            <p className="text-gray-400" style={{ fontSize: '0.82rem' }}>{completed.length} entries</p>
          </div>
          <span className="text-gray-500" style={{ fontWeight: 700 }}>{showCompleted ? 'Hide' : 'Show'}</span>
        </button>

        {showCompleted && (
          <div className="divide-y divide-gray-50">
            {completed.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No completed entries yet.</div>
            ) : (
              completed.map((entry) => (
                <div key={entry.id} className="p-5 flex items-center gap-4 opacity-60">
                  <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                    <span className="text-gray-700" style={{ fontWeight: 800, fontSize: '0.9rem' }}>{entry.position}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 truncate" style={{ fontWeight: 700, fontSize: '0.92rem' }}>{entry.patientName}</p>
                    <p className="text-gray-400" style={{ fontSize: '0.78rem' }}>Waited {entry.actualWaitMinutes} mins</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full ${statusConfig.completed.bg} ${statusConfig.completed.text}`} style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    Completed
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}