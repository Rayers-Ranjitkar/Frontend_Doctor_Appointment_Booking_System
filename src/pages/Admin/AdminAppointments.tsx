import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

const PAGE_SIZE = 12;

export default function AdminAppointments() {
  const { appointments } = useClinic();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = appointments.filter((a) => {
    const matchStatus = !statusFilter || a.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || a.patientName.toLowerCase().includes(q) || a.doctorName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>All Appointments</h1>
        <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Monitor bookings, payment state, and appointment lifecycle across the platform.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search patient or doctor..."
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-blue-400"
          style={{ fontSize: '0.9rem' }}
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-600 outline-none"
          style={{ fontSize: '0.9rem' }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
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
              {paginated.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-gray-800" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{appointment.patientName}</td>
                  <td className="px-5 py-4 text-gray-600" style={{ fontSize: '0.84rem' }}>{appointment.doctorName}</td>
                  <td className="px-5 py-4 text-gray-600" style={{ fontSize: '0.84rem' }}>{appointment.date} • {appointment.time}</td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full capitalize text-xs font-bold ${
                      appointment.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                      appointment.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      appointment.status === 'completed' ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-5 py-4"><span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 capitalize" style={{ fontSize: '0.76rem', fontWeight: 700 }}>{appointment.paymentStatus.replace('_', ' ')}</span></td>
                  <td className="px-5 py-4 text-gray-600" style={{ fontSize: '0.84rem' }}>{appointment.queueNumber || '-'}</td>
                  <td className="px-5 py-4">
                    {appointment.reminderStatus?.sent24h || appointment.reminderStatus?.sent1h ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700" style={{ fontSize: '0.76rem', fontWeight: 700 }}>Email sent</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600" style={{ fontSize: '0.76rem', fontWeight: 700 }}>Not sent</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400">No appointments found.</div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${p === page ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
      <p className="text-center text-gray-400" style={{ fontSize: '0.8rem' }}>
        Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} appointments
      </p>
    </div>
  );
}
