import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Clock, Search, UserCheck, Users } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { filterQueueEntriesForToday, todayLocalYMD } from '../../utils/calendarDate';
import React from 'react';

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  waiting: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Waiting' },
  in_consultation: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In consultation' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
};

// Real-time queue tracker allowing patients to monitor their wait time and position
export default function PatientQueue() {
  const navigate = useNavigate();
  const { queueEntries, currentPatient, appointments, fetchQueue } = useClinic();

  useEffect(() => {
    void fetchQueue();
  }, [fetchQueue]);

  // Calculate the patient's queue position and wait time for today
  const myEntries = useMemo(() => {
    const today = todayLocalYMD();
    const todayQueues = filterQueueEntriesForToday(queueEntries, appointments, today);
    return todayQueues
      .filter((entry) => entry.patientId === currentPatient.id)
      .slice()
      .sort((a, b) => (b as unknown as { createdAt?: string }).createdAt?.localeCompare((a as unknown as { createdAt?: string }).createdAt || '') || 0);
  }, [queueEntries, currentPatient.id, appointments]);

  const activeEntry = useMemo(() => myEntries.find((e) => e.status === 'waiting' || e.status === 'in_consultation'), [myEntries]);
  const completedEntries = useMemo(() => myEntries.filter((e) => e.status === 'completed'), [myEntries]);

  const appointment = activeEntry ? appointments.find((a) => a.id === activeEntry.appointmentId) : undefined;
  const doctorName = appointment?.doctorName || 'Your doctor';
  const specialty = appointment?.specialty || '';

  return (
    <div className="space-y-6">
      {/* --- Queue Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Queue Status</h1>
          <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Track your position for today&apos;s visit only.</p>
        </div>
        <button
          onClick={() => void fetchQueue()}
          className="self-start px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
          style={{ fontWeight: 600 }}
        >
          Refresh
        </button>
      </div>

      {/* --- Active Queue Status Tracker --- */}
      {activeEntry ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <span className="text-blue-600" style={{ fontWeight: 800, fontSize: '2rem' }}>{activeEntry.position}</span>
              </div>
              <div>
                <p className="text-gray-500 mb-1" style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Position</p>
                <p className="text-gray-900" style={{ fontSize: '1.05rem', fontWeight: 800 }}>{doctorName}</p>
                {specialty ? <p className="text-blue-600" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{specialty}</p> : null}
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <div className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                <Clock size={15} /> Estimated Wait: {activeEntry.estimatedWaitMinutes} mins
              </div>
              <span className={`px-3 py-1 rounded-full ${statusConfig[activeEntry.status].bg} ${statusConfig[activeEntry.status].text}`} style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                {statusConfig[activeEntry.status].label}
              </span>
              {activeEntry.status === 'in_consultation' ? (
                <p className="text-blue-600" style={{ fontSize: '0.82rem', fontWeight: 700 }}>You are now being seen</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          {/* --- Empty State Fallback --- */}
          <Users size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">You have no active queue position right now.</p>
          <button
            onClick={() => navigate('/patient/search')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
            style={{ fontWeight: 600 }}
          >
            <Search size={18} /> Book Appointment
          </button>
        </div>
      )}

      {/* --- Completed Queue Entries History --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-gray-900" style={{ fontSize: '1.05rem', fontWeight: 700 }}>Today&apos;s completed</h2>
          <span className="text-gray-400" style={{ fontSize: '0.82rem' }}>{completedEntries.length} completed</span>
        </div>
        {completedEntries.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No completed visits in the queue today yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {completedEntries.map((entry) => {
              const appt = appointments.find((a) => a.id === entry.appointmentId);
              return (
                <div key={entry.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <UserCheck size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 truncate" style={{ fontWeight: 700, fontSize: '0.92rem' }}>{appt?.doctorName || 'Doctor'}</p>
                    <p className="text-gray-400 truncate" style={{ fontSize: '0.78rem' }}>{appt?.specialty || ''}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gray-700" style={{ fontSize: '0.82rem', fontWeight: 700 }}>#{entry.position}</p>
                    <p className="text-gray-400" style={{ fontSize: '0.78rem' }}>{entry.actualWaitMinutes} mins</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}