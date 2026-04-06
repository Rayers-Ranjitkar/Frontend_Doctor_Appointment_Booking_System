import { useState } from 'react';
import { Plus, X, Clock, Calendar, CheckCircle, Save } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ALL_TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM', '01:30 PM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
];

type DaySchedule = {
  active: boolean;
  slots: string[];
};

const initialSchedule: Record<string, DaySchedule> = {
  Monday: { active: true, slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'] },
  Tuesday: { active: true, slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
  Wednesday: { active: false, slots: [] },
  Thursday: { active: true, slots: ['09:00 AM', '09:30 AM', '10:00 AM', '02:00 PM', '03:00 PM', '03:30 PM', '04:00 PM'] },
  Friday: { active: true, slots: ['09:00 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:30 PM', '03:00 PM'] },
  Saturday: { active: false, slots: [] },
  Sunday: { active: false, slots: [] },
};

export default function DoctorSchedule() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [saved, setSaved] = useState(false);
  const [consultDuration, setConsultDuration] = useState(30);
  const totalSlots = Object.values(schedule).reduce((sum, d) => sum + d.slots.length, 0);
  const activeDays = Object.values(schedule).filter(d => d.active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage Schedule</h1>
          <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Configure your weekly availability and time slots</p>
        </div>
        <button className={`self-start flex items-center gap-2 px-6 py-3 rounded-xl hover:shadow-lg transition-all ${saved ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white'}`} style={{ fontWeight: 600 }}>
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Schedule</>}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Days', value: activeDays, icon: Calendar, bg: 'bg-emerald-50', text: 'text-emerald-600' },
          { label: 'Total Slots', value: totalSlots, icon: Clock, bg: 'bg-blue-50', text: 'text-blue-600' },
          { label: "Today's Slots", value: schedule['Monday']?.slots.length || 0, icon: CheckCircle, bg: 'bg-purple-50', text: 'text-purple-600' },
          { label: 'Duration (min)', value: consultDuration, icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-2`}
            >
              <s.icon size={20} className={s.text} />
            </div>
            <p
              className="text-gray-900"
              style={{ fontSize: "1.5rem", fontWeight: 800 }}
            >
              {s.value}
            </p>
            <p className="text-gray-500" style={{ fontSize: "0.78rem" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

