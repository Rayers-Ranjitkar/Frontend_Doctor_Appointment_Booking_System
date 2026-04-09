import { useState } from 'react';
import { Plus, X, Clock, Calendar, CheckCircle, Save } from 'lucide-react';

// Days of the week
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// All possible selectable time slots
const ALL_TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM', '01:30 PM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
];

// Type definition for each day
type DaySchedule = {
  active: boolean; // is doctor available on this day
  slots: string[]; // selected time slots
};

// Initial schedule setup
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

  // ================= STATE =================
  const [schedule, setSchedule] = useState(initialSchedule); // full weekly schedule
  const [selectedDay, setSelectedDay] = useState('Monday'); // currently selected day in UI
  const [saved, setSaved] = useState(false); // save button feedback
  const [consultDuration, setConsultDuration] = useState(30); // duration per consultation
  const [breakStart, setBreakStart] = useState('12:00 PM'); // (not used yet)
  const [breakEnd, setBreakEnd] = useState('01:00 PM'); // (not used yet)

  // ================= LOGIC =================

  // Toggle day ON/OFF
  const toggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        active: !prev[day].active,

        // Clears slots when turning OFF
        slots: prev[day].active ? [] : prev[day].slots,
      },
    }));
  };

  // Add/remove a slot for selected day
  const toggleSlot = (slot: string) => {
    setSchedule(prev => {
      const current = prev[selectedDay].slots;

      // If slot exists → remove it, else add it
      const updated = current.includes(slot)
        ? current.filter(s => s !== slot)
        : [...current, slot];

      return {
        ...prev,
        [selectedDay]: { ...prev[selectedDay], slots: updated }
      };
    });
  };

  // Select all slots for selected day
  const addAllSlots = () => {
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: { ...prev[selectedDay], slots: [...ALL_TIME_SLOTS] },
    }));
  };

  // Remove all slots
  const clearSlots = () => {
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: { ...prev[selectedDay], slots: [] },
    }));
  };

  // Save handler (currently UI-only)
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ================= DERIVED VALUES =================

  // Total slots across week
  const totalSlots = Object.values(schedule)
    .reduce((sum, d) => sum + d.slots.length, 0);

  // Total active days
  const activeDays = Object.values(schedule)
    .filter(d => d.active).length;

  // ================= UI =================

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            Manage Schedule
          </h1>
          <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>
            Configure your weekly availability and time slots
          </p>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className={`self-start flex items-center gap-2 px-6 py-3 rounded-xl hover:shadow-lg transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white'
          }`}
          style={{ fontWeight: 600 }}
        >
          {saved ? (
            <>
              <CheckCircle size={18} /> Saved!
            </>
          ) : (
            <>
              <Save size={18} /> Save Schedule
            </>
          )}
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Days', value: activeDays, icon: Calendar },
          { label: 'Total Slots', value: totalSlots, icon: Clock },

          { label: "Today's Slots", value: schedule['Monday']?.slots.length || 0, icon: CheckCircle },

          { label: 'Duration (min)', value: consultDuration, icon: Clock },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border shadow-sm">
            <s.icon size={20} />
            <p>{s.value}</p>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT: DAY SELECTOR */}
        <div>
          {DAYS.map(day => {
            const dayData = schedule[day];

            return (
              <div key={day} onClick={() => setSelectedDay(day)}>

                {/* Toggle availability */}
                <button onClick={(e) => {
                  e.stopPropagation();
                  toggleDay(day);
                }}>
                  {dayData.active ? 'ON' : 'OFF'}
                </button>

                {/* Show slot count */}
                {dayData.active
                  ? `${dayData.slots.length} slots`
                  : 'Off'}
              </div>
            );
          })}
        </div>

        {/* RIGHT: SLOT MANAGEMENT */}
        <div className="lg:col-span-2">

          {/* If day is OFF */}
          {!schedule[selectedDay].active ? (
            <div>
              <p>Day Off</p>
              <button onClick={() => toggleDay(selectedDay)}>
                Enable Day
              </button>
            </div>
          ) : (
            <>
              {/* SLOT GRID */}
              {ALL_TIME_SLOTS.map(slot => {
                const selected = schedule[selectedDay].slots.includes(slot);

                return (
                  <button key={slot} onClick={() => toggleSlot(slot)}>
                    {slot} {selected ? '✓' : ''}
                  </button>
                );
              })}

              {/* SELECTED SLOT PREVIEW */}
              {schedule[selectedDay].slots.map(slot => (
                <div key={slot}>
                  {slot}
                  <button onClick={() => toggleSlot(slot)}>
                    <X size={10} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}