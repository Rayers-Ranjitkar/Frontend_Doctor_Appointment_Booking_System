import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Star, MapPin, Clock, Award, CheckCircle, Calendar, ChevronLeft, ChevronRight, Wallet } from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { apiRequest } from '@/utils/api';
import { formatLocalYMD } from '@/utils/calendarDate';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { doctors, bookAppointment, currentPatient } = useClinic();
  const doctor = doctors.find((item) => item.id === doctorId) || doctors[0];
  const today = new Date();
  
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'awaiting_payment'>('paid');
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;
    const apiDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    apiRequest<{ bookedSlots: string[] }>(`/doctors/${doctor.id}/booked-slots?date=${apiDate}`)
      .then((res) => setBookedSlots(res.bookedSlots))
      .catch(() => setBookedSlots([]));
  }, [selectedDate, currentMonth, currentYear, doctor.id]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const dayFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const isAvailableDay = (dayNum: number) => {
    const date = new Date(currentYear, currentMonth, dayNum);
    return doctor.availableDays.includes(dayFull[date.getDay()]);
  };

  const isPastDay = (dayNum: number) => {
    const date = new Date(currentYear, currentMonth, dayNum);
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const selectedDateObj = selectedDate ? new Date(currentYear, currentMonth, selectedDate) : null;
  const apiDate = selectedDateObj ? formatLocalYMD(selectedDateObj) : '';
  const formattedDate = selectedDateObj ? selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';

  const confirmBooking = async () => {
    if (!selectedDateObj || !selectedTime || !reason.trim()) return;
    setError('');
    setLoading(true);
    if (paymentStatus === 'paid') {
      try {
        const response = await apiRequest<{ khalti: { payment_url: string } }>('/payments/khalti/initiate', {
          method: 'POST',
          body: JSON.stringify({
            doctorId: doctor.id,
            patientId: currentPatient.id,
            patientName: currentPatient.name,
            patientAge: currentPatient.age,
            patientEmail: currentPatient.email,
            patientPhone: currentPatient.phone.replace(/[^\d]/g, '').slice(-10),
            date: apiDate,
            time: selectedTime,
            reason,
            notes,
          }),
        });
        window.location.href = response.khalti.payment_url;
      } catch (paymentError) {
        setError(paymentError instanceof Error ? paymentError.message : 'Unable to initiate Khalti payment.');
        setLoading(false);
      }
      return;
    }

    const result = await bookAppointment({
      doctorId: doctor.id,
      date: apiDate,
      time: selectedTime,
      reason,
      notes,
      paymentStatus,
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Unable to book appointment.');
      return;
    }
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-gray-900 mb-2" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Appointment Submitted</h2>
          <p className="text-gray-500 mb-6" style={{ fontSize: '0.9rem' }}>
            {paymentStatus === 'paid' ? 'Khalti payment completed and appointment confirmed.' : 'Appointment request saved. Complete payment later to confirm it.'}
          </p>
          <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left space-y-3">
            <div className="flex justify-between"><span className="text-gray-500" style={{ fontSize: '0.85rem' }}>Doctor</span><span className="text-gray-900" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{doctor.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500" style={{ fontSize: '0.85rem' }}>Date</span><span className="text-gray-900" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formattedDate}</span></div>
            <div className="flex justify-between"><span className="text-gray-500" style={{ fontSize: '0.85rem' }}>Time</span><span className="text-gray-900" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedTime}</span></div>
            <div className="flex justify-between"><span className="text-gray-500" style={{ fontSize: '0.85rem' }}>Payment</span><span className="text-gray-900 capitalize" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{paymentStatus.replace('_', ' ')}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/patient/appointments')} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all" style={{ fontWeight: 600 }}>View Appointments</button>
            <button onClick={() => navigate('/patient')} className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50" style={{ fontWeight: 600 }}>Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => step === 'confirm' ? setStep('select') : navigate('/patient/search')} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-gray-900" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{step === 'select' ? 'Book Appointment' : 'Confirm Appointment'}</h1>
          <p className="text-gray-400" style={{ fontSize: '0.8rem' }}>Khalti-supported checkout with double-booking prevention.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-fit">
          <div className="flex gap-4 mb-4">
            <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-xl object-cover object-top shrink-0" />
            <div>
              <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: '1rem' }}>{doctor.name}</h3>
              <p className="text-blue-600" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{doctor.specialty}</p>
              <div className="flex items-center gap-1 mt-1"><Star size={13} className="text-amber-400 fill-amber-400" /><span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{doctor.rating}</span></div>
            </div>
          </div>
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-500" style={{ fontSize: '0.82rem' }}><MapPin size={14} className="text-blue-400 shrink-0" /> {doctor.hospital}</div>
            <div className="flex items-center gap-2 text-gray-500" style={{ fontSize: '0.82rem' }}><Award size={14} className="text-purple-400 shrink-0" /> {doctor.experience} years experience</div>
            <div className="flex items-center gap-2 text-gray-500" style={{ fontSize: '0.82rem' }}><Clock size={14} className="text-green-400 shrink-0" /> {doctor.availableDays.join(', ')}</div>
            <div className="flex items-center gap-2 text-gray-500" style={{ fontSize: '0.82rem' }}><Wallet size={14} className="text-amber-500 shrink-0" /> NPR {doctor.price} via Khalti</div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          {step === 'select' ? (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: '1rem' }}>Select Date</h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => currentMonth === 0 ? (setCurrentYear((year) => year - 1), setCurrentMonth(11)) : setCurrentMonth((month) => month - 1)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"><ChevronLeft size={16} /></button>
                    <span className="text-gray-700 min-w-[140px] text-center" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{MONTHS[currentMonth]} {currentYear}</span>
                    <button onClick={() => currentMonth === 11 ? (setCurrentYear((year) => year + 1), setCurrentMonth(0)) : setCurrentMonth((month) => month + 1)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"><ChevronRight size={16} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map((day) => <div key={day} className="text-center text-gray-400 py-2" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, index) => <div key={`empty-${index}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const available = isAvailableDay(day);
                    const past = isPastDay(day);
                    const selected = selectedDate === day;
                    return (
                      <button key={day} onClick={() => { if (available && !past) { setSelectedDate(day); setSelectedTime(null); } }} disabled={!available || past} className={`h-10 w-full rounded-xl flex items-center justify-center transition-all ${selected ? 'bg-blue-600 text-white shadow-lg' : ''} ${!selected && available && !past ? 'hover:bg-blue-50 text-gray-700' : ''} ${(!available || past) ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}`} style={{ fontSize: '0.85rem', fontWeight: selected ? 700 : 400 }}>{day}</button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-gray-900 mb-4" style={{ fontWeight: 700, fontSize: '1rem' }}>Select Time Slot</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {doctor.timeSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <button
                          key={time}
                          onClick={() => { if (!isBooked) setSelectedTime(time); }}
                          disabled={isBooked}
                          className={`py-2.5 px-3 rounded-xl border text-center transition-all
                            ${isBooked ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through' : ''}
                            ${!isBooked && selectedTime === time ? 'bg-blue-600 text-white border-blue-600 shadow-md' : ''}
                            ${!isBooked && selectedTime !== time ? 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50' : ''}`}
                          style={{ fontSize: '0.8rem', fontWeight: selectedTime === time ? 700 : 400 }}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedTime && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                  <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: '1rem' }}>Visit Details</h3>
                  <input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason for visit" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-400" />
                  <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Additional notes (optional)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-blue-400" />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button onClick={() => setPaymentStatus('paid')} className={`px-4 py-3 rounded-xl border ${paymentStatus === 'paid' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600'}`} style={{ fontWeight: 600 }}>Pay with Khalti Now</button>
                    <button onClick={() => setPaymentStatus('awaiting_payment')} className={`px-4 py-3 rounded-xl border ${paymentStatus === 'awaiting_payment' ? 'bg-amber-500 text-white border-amber-500' : 'border-gray-200 text-gray-600'}`} style={{ fontWeight: 600 }}>Request First, Pay Later</button>
                  </div>
                  <button onClick={() => setStep('confirm')} disabled={!reason.trim()} className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontWeight: 700, fontSize: '1rem' }}>Continue to Confirm</button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Appointment Summary</h3>
              <div className="bg-blue-50 rounded-2xl p-5 space-y-3">
                {[{ label: 'Doctor', value: doctor.name }, { label: 'Specialty', value: doctor.specialty }, { label: 'Hospital', value: doctor.hospital }, { label: 'Date', value: formattedDate }, { label: 'Time', value: selectedTime || '' }, { label: 'Reason', value: reason }, { label: 'Payment', value: paymentStatus === 'paid' ? `Khalti - NPR ${doctor.price}` : 'Pending confirmation payment' }].map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4">
                    <span className="text-gray-500" style={{ fontSize: '0.85rem' }}>{item.label}</span>
                    <span className="text-gray-900 text-right" style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '60%' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              {error ? <div className="p-4 rounded-xl bg-red-50 text-red-600" style={{ fontSize: '0.84rem', fontWeight: 600 }}>{error}</div> : null}
              <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-xl"><Calendar size={18} className="text-amber-500 shrink-0" /><p className="text-amber-700" style={{ fontSize: '0.82rem' }}>This workflow prevents double booking and records Khalti payment status with the appointment.</p></div>
              <button onClick={() => void confirmBooking()} disabled={loading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed" style={{ fontWeight: 700, fontSize: '1rem' }}>
                {loading ? (paymentStatus === 'paid' ? 'Redirecting to Khalti...' : 'Booking...') : 'Confirm Appointment'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
