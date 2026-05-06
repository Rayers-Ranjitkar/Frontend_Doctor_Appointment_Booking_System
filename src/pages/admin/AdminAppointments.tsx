import { useClinic } from '@/context/ClinicContext';

export default function AdminAppointments() {
  const { appointments } = useClinic();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>All Appointments</h1>
        <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Monitor bookings, payment state, and appointment lifecycle across the platform.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Patient', 'Doctor', 'Date', 'Status', 'Payment', 'Queue', 'Email'].map((label) => (
                  <th key={label} className="text-left px-5 py-3 text-gray-400" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-5 py-4 text-gray-800" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{appointment.patientName}</td>
                  <td className="px-5 py-4 text-gray-600" style={{ fontSize: '0.84rem' }}>{appointment.doctorName}</td>
                  <td className="px-5 py-4 text-gray-600" style={{ fontSize: '0.84rem' }}>{appointment.date} • {appointment.time}</td>
                  <td className="px-5 py-4"><span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 capitalize" style={{ fontSize: '0.76rem', fontWeight: 700 }}>{appointment.status}</span></td>
                  <td className="px-5 py-4"><span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 capitalize" style={{ fontSize: '0.76rem', fontWeight: 700 }}>{appointment.paymentStatus.replace('_', ' ')}</span></td>
                  <td className="px-5 py-4 text-gray-600" style={{ fontSize: '0.84rem' }}>{appointment.queueNumber || '-'}</td>
                  <td className="px-5 py-4">
                    {appointment.reminderStatus?.sent24h || appointment.reminderStatus?.sent1h ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                        Email sent
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                        Not sent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
