import { useNavigate } from 'react-router';
import { Calendar, Clock, CheckCircle, XCircle, ChevronRight, Star, Search, CalendarDays, User } from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { useAuth } from '@/constants/AuthContext';

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appointments, doctors, currentPatient } = useClinic();

  const patientAppointments = appointments.filter((a) => a.patientId === currentPatient.id);
  const upcoming = patientAppointments.filter((a) => a.status === 'confirmed' || a.status === 'pending');
  const completed = patientAppointments.filter((a) => a.status === 'completed');
  const cancelled = patientAppointments.filter((a) => a.status === 'cancelled');
  const doctorsVisited = new Set(patientAppointments.map((a) => a.doctorId)).size;

  const firstName = (user?.name || currentPatient.name).split(' ')[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}, {firstName}! 👋
          </h1>
          <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Here's your health overview for today</p>
        </div>
        <button onClick={() => navigate('/patient/search')} className="self-start flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all" style={{ fontWeight: 600 }}>
          <Search size={18} /> Book Appointment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming', value: upcoming.length, icon: Calendar, bg: 'bg-blue-50', text: 'text-blue-600', desc: 'Scheduled' },
          { label: 'Completed', value: completed.length, icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-600', desc: 'Visits done' },
          { label: 'Cancelled', value: cancelled.length, icon: XCircle, bg: 'bg-red-50', text: 'text-red-600', desc: 'This year' },
          { label: 'Doctors Visited', value: doctorsVisited, icon: Star, bg: 'bg-amber-50', text: 'text-amber-600', desc: 'Specialists' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={22} className={s.text} />
            </div>
            <p className="text-gray-900 mb-0.5" style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.value}</p>
            <p className="text-gray-800" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.label}</p>
            <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-gray-900" style={{ fontSize: '1.05rem', fontWeight: 700 }}>Upcoming Appointments</h2>
            <button onClick={() => navigate('/patient/appointments')} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming appointments</p>
              <button onClick={() => navigate('/patient/search')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl" style={{ fontSize: '0.85rem' }}>Book Now</button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcoming.map((appt) => (
                <div key={appt.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <img src={appt.doctorImage} alt={appt.doctorName} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 truncate" style={{ fontWeight: 700, fontSize: '0.95rem' }}>{appt.doctorName}</p>
                    <p className="text-blue-600 truncate" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{appt.specialty}</p>
                    <p className="text-gray-400 truncate" style={{ fontSize: '0.78rem' }}>{appt.reason}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1.5 justify-end mb-1">
                      <Calendar size={13} className="text-gray-400" />
                      <span className="text-gray-700" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end mb-2">
                      <Clock size={13} className="text-gray-400" />
                      <span className="text-gray-500" style={{ fontSize: '0.78rem' }}>{appt.time}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full capitalize ${statusBadge(appt.status)}`} style={{ fontSize: '0.72rem', fontWeight: 600 }}>{appt.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Doctors */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-gray-900" style={{ fontSize: '1.05rem', fontWeight: 700 }}>Top Doctors</h2>
            <button onClick={() => navigate('/patient/search')} className="text-blue-600 hover:text-blue-800" style={{ fontSize: '0.82rem', fontWeight: 600 }}>See All</button>
          </div>
          <div className="divide-y divide-gray-50">
            {doctors.slice(0, 4).map((doc) => (
              <div key={doc.id} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <img src={doc.image} alt={doc.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate" style={{ fontWeight: 600, fontSize: '0.85rem' }}>{doc.name}</p>
                  <p className="text-gray-500 truncate" style={{ fontSize: '0.75rem' }}>{doc.specialty}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{doc.rating}</span>
                  </div>
                  <button onClick={() => navigate(`/patient/book/${doc.id}`)} className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" style={{ fontSize: '0.75rem' }}>Book</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Search Doctors', desc: 'Find specialists', icon: Search, colorClass: 'bg-blue-100 text-blue-600', path: '/patient/search' },
          { label: 'My Appointments', desc: 'View history', icon: CalendarDays, colorClass: 'bg-purple-100 text-purple-600', path: '/patient/appointments' },
          { label: 'Reschedule', desc: 'Change booking', icon: Clock, colorClass: 'bg-amber-100 text-amber-600', path: '/patient/appointments' },
          { label: 'My Profile', desc: 'Manage info', icon: User, colorClass: 'bg-green-100 text-green-600', path: '/patient/profile' },
        ].map((action) => (
          <button key={action.label} onClick={() => navigate(action.path)} className="bg-white rounded-2xl p-5 text-left hover:shadow-md transition-all border border-gray-100 group">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${action.colorClass.split(' ')[0]}`}>
              <action.icon size={20} className={action.colorClass.split(' ')[1]} />
            </div>
            <p className="text-gray-900 group-hover:text-blue-600 transition-colors" style={{ fontWeight: 600, fontSize: '0.88rem' }}>{action.label}</p>
            <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
