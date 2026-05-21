import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Clock, MapPin, RotateCcw, Star, X } from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

type Tab = 'upcoming' | 'past' | 'cancelled';

export default function MyAppointments() {
  const navigate = useNavigate();
  const { currentPatient, appointments, updateAppointmentStatus, rescheduleAppointment, addReview, doctors } = useClinic();
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('2026-04-05');
  const [newTime, setNewTime] = useState('09:00 AM');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');

  const myAppointments = appointments.filter((appointment) => appointment.patientId === currentPatient.id);
  const upcoming = myAppointments.filter((appointment) => appointment.status === 'confirmed' || appointment.status === 'pending');
  const past = myAppointments.filter((appointment) => appointment.status === 'completed');
  const cancelled = myAppointments.filter((appointment) => appointment.status === 'cancelled');
  const displayed = activeTab === 'upcoming' ? upcoming : activeTab === 'past' ? past : cancelled;

  const submitReschedule = async () => {
    if (!rescheduleId) return;
    const result = await rescheduleAppointment(rescheduleId, newDate, newTime);
    if (!result.ok) {
      setError(result.error || 'Unable to reschedule.');
      return;
    }
    setError('');
    setRescheduleId(null);
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
    { id: 'past', label: 'Past', count: past.length },
    { id: 'cancelled', label: 'Cancelled', count: cancelled.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Appointments</h1>
          <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Manage bookings, reschedules, cancellations, payments, and reviews.</p>
        </div>
        <button onClick={() => navigate('/patient/search')} className="self-start px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
          + Book New
        </button>
      </div>

      <div className="flex gap-2 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm w-fit">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`} style={{ fontWeight: 600, fontSize: '0.88rem' }}>
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`} style={{ fontSize: '0.72rem' }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">No {activeTab} appointments.</div>
      ) : (
        <div className="space-y-4">
          {displayed.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex gap-4">
                  <img src={appointment.doctorImage} alt={appointment.doctorName} className="w-16 h-16 rounded-2xl object-cover object-top shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                      <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: '1rem' }}>{appointment.doctorName}</h3>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 capitalize" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{appointment.status}</span>
                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 capitalize" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{appointment.paymentStatus.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <p className="text-blue-600 mb-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{appointment.specialty}</p>
                    <div className="flex flex-wrap gap-4">
                      <span className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: '0.8rem' }}><Calendar size={13} /> {appointment.date}</span>
                      <span className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: '0.8rem' }}><Clock size={13} /> {appointment.time}</span>
                      <span className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: '0.8rem' }}><MapPin size={13} /> {appointment.hospital}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <p className="text-gray-500" style={{ fontSize: '0.82rem' }}><span style={{ fontWeight: 600 }}>Reason:</span> {appointment.reason}</p>
                    </div>
                  </div>
                </div>
              </div>

              {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                <div className="px-5 pb-4 flex gap-2 flex-wrap">
                  <button onClick={() => { setRescheduleId(appointment.id); setNewDate(appointment.date); setNewTime(appointment.time); }} className="flex items-center gap-1.5 px-4 py-2 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    <RotateCcw size={14} /> Reschedule
                  </button>
                  <button onClick={() => setCancelId(appointment.id)} className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    <X size={14} /> Cancel
                  </button>
                </div>
              )}

              {appointment.status === 'completed' && (
                <div className="px-5 pb-4 flex gap-2">
                  <button onClick={() => { setReviewId(appointment.id); setRating(0); setReviewText(''); }} className="flex items-center gap-1.5 px-4 py-2 border border-amber-200 text-amber-600 rounded-xl hover:bg-amber-50 transition-colors" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    <Star size={14} /> Leave Review
                  </button>
                  <button onClick={() => navigate(`/patient/book/${appointment.doctorId}`)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    <RotateCcw size={14} /> Book Again
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <h3 className="text-gray-900 mb-2" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Cancel Appointment?</h3>
            <p className="text-gray-500 mb-6" style={{ fontSize: '0.88rem' }}>This updates the appointment status and releases the time slot.</p>
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50" style={{ fontWeight: 600 }}>Keep It</button>
              <button onClick={() => { void updateAppointmentStatus(cancelId, 'cancelled'); setCancelId(null); }} className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors" style={{ fontWeight: 600 }}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {rescheduleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-gray-900 mb-2" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Reschedule Appointment</h3>
            <p className="text-gray-500 mb-5" style={{ fontSize: '0.88rem' }}>Conflict checks are applied before saving the new slot.</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <input type="date" value={newDate} onChange={(event) => setNewDate(event.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <select value={newTime} onChange={(event) => setNewTime(event.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none">
                {(doctors.find(d => d.id === appointments.find(a => a.id === rescheduleId)?.doctorId)?.timeSlots || []).map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            {error ? <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{error}</div> : null}
            <div className="flex gap-3">
              <button onClick={() => { setRescheduleId(null); setError(''); }} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50" style={{ fontWeight: 600 }}>Cancel</button>
              <button onClick={() => void submitReschedule()} className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors" style={{ fontWeight: 600 }}>Save New Slot</button>
            </div>
          </div>
        </div>
      )}

      {reviewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-gray-900 mb-2" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Leave a Review</h3>
            <p className="text-gray-500 mb-5" style={{ fontSize: '0.85rem' }}>Ratings are attached to completed appointments only.</p>
            <div className="flex gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="text-3xl transition-transform hover:scale-110">{star <= rating ? '⭐' : '☆'}</button>
              ))}
            </div>
            <textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} placeholder="Tell us about your experience..." rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 outline-none resize-none mb-5 focus:border-blue-400" style={{ fontSize: '0.88rem' }} />
            <div className="flex gap-3">
              <button onClick={() => setReviewId(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50" style={{ fontWeight: 600 }}>Cancel</button>
              <button
                onClick={() => {
                  const appointment = appointments.find((item) => item.id === reviewId);
                  if (!appointment || !rating) return;
                  void addReview({ appointmentId: appointment.id, doctorId: appointment.doctorId, rating, comment: reviewText });
                  setReviewId(null);
                }}
                disabled={!rating}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white rounded-xl hover:shadow-md transition-all disabled:opacity-50"
                style={{ fontWeight: 600 }}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
