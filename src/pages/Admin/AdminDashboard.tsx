import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Activity, Calendar, ChevronRight, MailCheck, ShieldCheck, Stethoscope, Users } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { useAuth } from '@/constants/AuthContext';

const statusConfig: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: 'bg-green-100', text: 'text-green-700' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-700' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { doctors, patients, appointments, payments } = useClinic();
  const { createAdmin } = useAuth();
  const [adminForm, setAdminForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [adminMessage, setAdminMessage] = useState('');

  const recentAppointments = appointments.slice(0, 6);
  const reminderSentCount = appointments.filter((appointment) => appointment.reminderStatus?.sent24h || appointment.reminderStatus?.sent1h).length;
  const pendingVerificationCount = doctors.filter((doctor) => doctor.verificationStatus === 'pending').length;
  const revenue = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);

  const submitAdmin = async () => {
    const result = await createAdmin(adminForm);
    if (!result.ok) {
      setAdminMessage(result.error || 'Unable to create admin.');
      return;
    }
    setAdminMessage('Admin account created successfully.');
    setAdminForm({ name: '', username: '', email: '', phone: '', password: '' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Admin Dashboard</h1>
        <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>System overview with verification and reminder delivery visibility.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Doctors', value: doctors.length, icon: Stethoscope, bg: 'bg-purple-50', text: 'text-purple-600' },
          { label: 'Total Patients', value: patients.length, icon: Users, bg: 'bg-blue-50', text: 'text-blue-600' },
          { label: 'Appointments', value: appointments.length, icon: Calendar, bg: 'bg-emerald-50', text: 'text-emerald-600' },
          { label: 'Revenue', value: `NPR ${revenue.toLocaleString()}`, icon: Activity, bg: 'bg-amber-50', text: 'text-amber-600' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon size={22} className={card.text} />
            </div>
            <p className="text-gray-900 mb-0.5" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{card.value}</p>
            <p className="text-gray-500" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Requests', value: appointments.filter((appointment) => appointment.status === 'pending').length, color: 'bg-amber-500' },
          { label: 'Reminder Emails Sent', value: reminderSentCount, color: 'bg-blue-500' },
          { label: 'Pending Verification', value: pendingVerificationCount, color: 'bg-purple-500' },
          { label: 'Paid Appointments', value: appointments.filter((appointment) => appointment.paymentStatus === 'paid').length, color: 'bg-green-500' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`w-3 h-10 rounded-full ${item.color} shrink-0`} />
            <div>
              <p className="text-gray-900" style={{ fontSize: '1.3rem', fontWeight: 800 }}>{item.value}</p>
              <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-gray-900" style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Appointments</h2>
          <button onClick={() => navigate('/admin/appointments')} className="flex items-center gap-1 text-purple-600 hover:text-purple-800" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Patient', 'Doctor', 'Date', 'Status', 'Email Status'].map((heading) => (
                  <th key={heading} className="text-left px-5 py-3 text-gray-400" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentAppointments.map((appointment) => {
                const style = statusConfig[appointment.status];
                const sent = appointment.reminderStatus?.sent24h || appointment.reminderStatus?.sent1h;
                return (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-gray-800" style={{ fontWeight: 600, fontSize: '0.88rem' }}>{appointment.patientName}</p>
                      <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>{appointment.specialty}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-800" style={{ fontSize: '0.85rem' }}>{appointment.doctorName}</td>
                    <td className="px-5 py-3.5 text-gray-500" style={{ fontSize: '0.82rem' }}>{appointment.date} · {appointment.time}</td>
                    <td className="px-5 py-3.5"><span className={`px-3 py-1 rounded-full capitalize ${style.bg} ${style.text}`} style={{ fontSize: '0.72rem', fontWeight: 700 }}>{appointment.status}</span></td>
                    <td className="px-5 py-3.5">
                      {sent ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                          <MailCheck size={13} /> Email Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage Doctors', desc: `${doctors.length} registered doctors`, path: '/admin/doctors', icon: Stethoscope, color: 'from-purple-500 to-violet-600' },
          { label: 'Doctor Verification', desc: `${pendingVerificationCount} verification requests`, path: '/admin/verification', icon: ShieldCheck, color: 'from-blue-500 to-cyan-500' },
          { label: 'Reminder Tracking', desc: `${reminderSentCount} appointments already emailed`, path: '/admin/appointments', icon: MailCheck, color: 'from-emerald-500 to-teal-500' },
        ].map((item) => (
          <button key={item.label} onClick={() => navigate(item.path)} className="bg-white rounded-2xl p-5 text-left hover:shadow-md transition-all border border-gray-100 flex items-center gap-4 group">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
              <item.icon size={22} className="text-white" />
            </div>
            <div>
              <p className="text-gray-900 group-hover:text-purple-600 transition-colors" style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.label}</p>
              <p className="text-gray-400" style={{ fontSize: '0.78rem' }}>{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="mb-5">
          <h2 className="text-gray-900" style={{ fontSize: '1.05rem', fontWeight: 700 }}>Create Admin Account</h2>
          <p className="text-gray-500" style={{ fontSize: '0.82rem' }}>Create additional internal admin credentials stored in the database.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <input value={adminForm.name} onChange={(event) => setAdminForm((current) => ({ ...current, name: event.target.value }))} placeholder="Full name" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
          <input value={adminForm.username} onChange={(event) => setAdminForm((current) => ({ ...current, username: event.target.value }))} placeholder="Username" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
          <input value={adminForm.email} onChange={(event) => setAdminForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
          <input value={adminForm.phone} onChange={(event) => setAdminForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
          <input type="password" value={adminForm.password} onChange={(event) => setAdminForm((current) => ({ ...current, password: event.target.value }))} placeholder="Password" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none md:col-span-2" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={() => void submitAdmin()} className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white" style={{ fontWeight: 600 }}>
            Create Admin
          </button>
          {adminMessage ? <p className="text-gray-600" style={{ fontSize: '0.84rem', fontWeight: 600 }}>{adminMessage}</p> : null}
        </div>
      </div>
    </div>
  );
}
