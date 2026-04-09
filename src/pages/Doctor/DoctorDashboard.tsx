import { useNavigate } from 'react-router';
import { Users, Calendar, Clock, CheckCircle, ChevronRight, TrendingUp } from 'lucide-react';
import { appointments, doctors, chartData } from '@/utils/mockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const doctor = doctors[0]; // Dr. James Wilson
const doctorAppointments = appointments.filter(a => a.doctorId === 'd1');
const todayAppts = doctorAppointments.filter(a => a.date === '2026-03-17');
const upcoming = doctorAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending');

const statusConfig: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: 'bg-green-100', text: 'text-green-700' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-700' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
};

export default function DoctorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Good Morning, Dr. Wilson! 👋</h1>
          <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Tuesday, March 17, 2026 — You have <span className="text-emerald-600" style={{ fontWeight: 700 }}>{todayAppts.length} appointments</span> today</p>
        </div>
        <button onClick={() => navigate('/doctor/schedule')} className="self-start flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all" style={{ fontWeight: 600 }}>
          <Clock size={18} /> Manage Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Patients", value: todayAppts.length, icon: Calendar, bg: 'bg-emerald-50', text: 'text-emerald-600', desc: 'March 17, 2026', trend: '+2 vs yesterday' },
          { label: 'Total Patients', value: doctor.patients.toLocaleString(), icon: Users, bg: 'bg-blue-50', text: 'text-blue-600', desc: 'All time', trend: '+12 this month' },
          { label: 'Upcoming', value: upcoming.length, icon: Clock, bg: 'bg-purple-50', text: 'text-purple-600', desc: 'Scheduled', trend: 'Next: 9:30 AM' },
          { label: 'Completed', value: doctorAppointments.filter(a => a.status === 'completed').length, icon: CheckCircle, bg: 'bg-amber-50', text: 'text-amber-600', desc: 'This month', trend: '96% satisfaction' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={22} className={s.text} />
              </div>
              <span className="text-green-500 flex items-center gap-1" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                <TrendingUp size={11} /> {s.trend}
              </span>
            </div>
            <p className="text-gray-900 mb-0.5" style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.value}</p>
            <p className="text-gray-800" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.label}</p>
            <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-gray-900" style={{ fontSize: '1.05rem', fontWeight: 700 }}>Today's Schedule</h2>
            <button onClick={() => navigate('/doctor/appointments')} className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          {todayAppts.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {todayAppts.map((appt, idx) => {
                const sc = statusConfig[appt.status];
                return (
                  <div key={appt.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <span className="text-emerald-600" style={{ fontWeight: 800, fontSize: '0.75rem' }}>#{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate" style={{ fontWeight: 700, fontSize: '0.95rem' }}>{appt.patientName}</p>
                      <p className="text-gray-500 truncate" style={{ fontSize: '0.8rem' }}>Age {appt.patientAge} • {appt.reason}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 justify-end mb-2">
                        <Clock size={13} className="text-gray-400" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{appt.time}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full capitalize ${sc.bg} ${sc.text}`} style={{ fontSize: '0.72rem', fontWeight: 600 }}>{appt.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Appointment Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-gray-900 mb-4" style={{ fontSize: '1.05rem', fontWeight: 700 }}>Quick Stats</h2>
          <div className="space-y-4">
            {[
              { label: 'Pending Approval', value: doctorAppointments.filter(a => a.status === 'pending').length, color: 'bg-amber-500', max: 10 },
              { label: 'Confirmed', value: doctorAppointments.filter(a => a.status === 'confirmed').length, color: 'bg-green-500', max: 10 },
              { label: 'Completed', value: doctorAppointments.filter(a => a.status === 'completed').length, color: 'bg-blue-500', max: 10 },
              { label: 'Cancelled', value: doctorAppointments.filter(a => a.status === 'cancelled').length, color: 'bg-red-400', max: 10 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-gray-600" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{item.label}</span>
                  <span className="text-gray-900" style={{ fontSize: '0.82rem', fontWeight: 700 }}>{item.value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-gray-500 mb-1" style={{ fontSize: '0.78rem' }}>This Month's Rating</p>
            <div className="flex items-end gap-2">
              <span className="text-gray-900" style={{ fontSize: '2rem', fontWeight: 800 }}>4.9</span>
              <div className="flex mb-1.5">
                {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400" style={{ fontSize: '0.9rem' }}>★</span>)}
              </div>
            </div>
            <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>Based on 342 reviews</p>
          </div>
        </div>
      </div>

      {/* Appointments Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900" style={{ fontSize: '1.05rem', fontWeight: 700 }}>Appointment Trends</h2>
          <span className="text-gray-400" style={{ fontSize: '0.82rem' }}>Last 6 months</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="appointments" stroke="#10B981" strokeWidth={2.5} fill="url(#colorAppt)" name="Total" />
            <Area type="monotone" dataKey="completed" stroke="#3B82F6" strokeWidth={2} fill="none" strokeDasharray="5 5" name="Completed" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}