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
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [saved, setSaved] = useState(false);
  const [consultDuration, setConsultDuration] = useState(30);
  const [breakStart, setBreakStart] = useState('12:00 PM');
  const [breakEnd, setBreakEnd] = useState('01:00 PM');

  const toggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active, slots: prev[day].active ? [] : prev[day].slots },
    }));
  };

  const toggleSlot = (slot: string) => {
    setSchedule(prev => {
      const current = prev[selectedDay].slots;
      const updated = current.includes(slot) ? current.filter(s => s !== slot) : [...current, slot];
      return { ...prev, [selectedDay]: { ...prev[selectedDay], slots: updated } };
    });
  };

  const addAllSlots = () => {
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: { ...prev[selectedDay], slots: [...ALL_TIME_SLOTS] },
    }));
  };

  const clearSlots = () => {
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: { ...prev[selectedDay], slots: [] },
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const totalSlots = Object.values(schedule).reduce((sum, d) => sum + d.slots.length, 0);
  const activeDays = Object.values(schedule).filter(d => d.active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage Schedule</h1>
          <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Configure your weekly availability and time slots</p>
        </div>
        <button onClick={handleSave} className={`self-start flex items-center gap-2 px-6 py-3 rounded-xl hover:shadow-lg transition-all ${saved ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white'}`} style={{ fontWeight: 600 }}>
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
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
              <s.icon size={20} className={s.text} />
            </div>
            <p className="text-gray-900" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</p>
            <p className="text-gray-500" style={{ fontSize: '0.78rem' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Day Selector */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-900 mb-4" style={{ fontWeight: 700, fontSize: '0.95rem' }}>Select Day</h3>
          <div className="space-y-2">
            {DAYS.map(day => {
              const dayData = schedule[day];
              return (
                <div key={day} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedDay === day ? 'bg-emerald-600 text-white' : 'hover:bg-gray-50'}`} onClick={() => setSelectedDay(day)}>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={e => { e.stopPropagation(); toggleDay(day); }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${dayData.active ? 'bg-white border-white' : selectedDay === day ? 'border-white/50' : 'border-gray-300'}`}
                    >
                      {dayData.active && <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />}
                    </button>
                    <span style={{ fontWeight: selectedDay === day ? 700 : 500, fontSize: '0.9rem' }}>{day}</span>
                  </div>
                  <div className="text-right">
                    {dayData.active ? (
                      <span className={`text-xs ${selectedDay === day ? 'text-white/80' : 'text-gray-500'}`}>{dayData.slots.length} slots</span>
                    ) : (
                      <span className={`text-xs ${selectedDay === day ? 'text-white/60' : 'text-gray-400'}`}>Off</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Settings */}
          <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
            <div>
              <label className="text-gray-500 block mb-1.5" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Consultation Duration</label>
              <select value={consultDuration} onChange={e => setConsultDuration(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 outline-none" style={{ fontSize: '0.85rem' }}>
                {[15, 20, 30, 45, 60].map(d => <option key={d} value={d}>{d} minutes</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedDay} — Time Slots</h3>
              <p className="text-gray-400 mt-0.5" style={{ fontSize: '0.78rem' }}>{schedule[selectedDay].slots.length} slots selected</p>
            </div>
            {schedule[selectedDay].active && (
              <div className="flex gap-2">
                <button onClick={addAllSlots} className="px-3 py-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Select All</button>
                <button onClick={clearSlots} className="px-3 py-1.5 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Clear All</button>
              </div>
            )}
          </div>

          {!schedule[selectedDay].active ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <X size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-3" style={{ fontSize: '0.95rem', fontWeight: 600 }}>Day Off</p>
              <p className="text-gray-400 mb-4" style={{ fontSize: '0.82rem' }}>{selectedDay} is currently set as a day off</p>
              <button onClick={() => toggleDay(selectedDay)} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors" style={{ fontWeight: 600, fontSize: '0.88rem' }}>Enable {selectedDay}</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
                {ALL_TIME_SLOTS.map(slot => {
                  const selected = schedule[selectedDay].slots.includes(slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => toggleSlot(slot)}
                      className={`py-2.5 px-2 rounded-xl border text-center transition-all ${selected ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50'}`}
                      style={{ fontSize: '0.8rem', fontWeight: selected ? 700 : 400 }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>

              {/* Selected Slots Preview */}
              {schedule[selectedDay].slots.length > 0 && (
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-emerald-700 mb-3" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Selected Time Slots for {selectedDay}:</p>
                  <div className="flex flex-wrap gap-2">
                    {[...schedule[selectedDay].slots].sort().map(slot => (
                      <span key={slot} className="flex items-center gap-1.5 px-3 py-1 bg-white text-emerald-700 rounded-full shadow-sm" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                        <Clock size={11} /> {slot}
                        <button onClick={() => toggleSlot(slot)} className="text-emerald-400 hover:text-emerald-700">
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
