import React from 'react'
import { useNavigate } from 'react-router'
import { Calendar, Clock,  ChevronRight } from 'lucide-react';
import { appointments, doctors } from '@/utils/mockData';

const patientAppointments = appointments.filter(a => a.patientId === 'p1');
const upcoming = patientAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending');

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

const UpcomingDashboard = () => {

  const navigate = useNavigate()


  return (
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

  )
}

export default UpcomingDashboard
