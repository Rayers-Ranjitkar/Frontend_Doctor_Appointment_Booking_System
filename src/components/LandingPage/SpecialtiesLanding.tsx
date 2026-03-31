import { Calendar, CheckCircle, XCircle, Star } from 'lucide-react';
import { appointments } from '@/utils/mockData';
const SpecialtiesLanding = () => {

const patientAppointments = appointments.filter(a => a.patientId === 'p1');
const upcoming = patientAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
const completed = patientAppointments.filter(a => a.status === 'completed');
const cancelled = patientAppointments.filter(a => a.status === 'cancelled');
  return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming', value: upcoming.length, icon: Calendar, bg: 'bg-blue-50', text: 'text-blue-600', desc: 'Scheduled' },
          { label: 'Completed', value: completed.length, icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-600', desc: 'Visits done' },
          { label: 'Cancelled', value: cancelled.length, icon: XCircle, bg: 'bg-red-50', text: 'text-red-600', desc: 'This year' },
          { label: 'Doctors Visited', value: 3, icon: Star, bg: 'bg-amber-50', text: 'text-amber-600', desc: 'Specialists' },
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

  )
}

export default SpecialtiesLanding