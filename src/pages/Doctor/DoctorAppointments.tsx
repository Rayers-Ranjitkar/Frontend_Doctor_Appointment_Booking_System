import React from 'react'

import { useState } from 'react';
import { Calendar, CheckCircle, Clock, Eye, Search, XCircle } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import type { Appointment } from '@/utils/clinicData';

type Status = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmed' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
};

export default function DoctorAppointments() {
  const { appointments, currentDoctor, updateAppointmentStatus } = useClinic();
  const [filterStatus, setFilterStatus] = useState<Status>('all');
  const [search, setSearch] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const doctorAppointments = appointments.filter((appointment) => appointment.doctorId === currentDoctor.id);
  const filtered = doctorAppointments.filter((appointment) => {
    const matchStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchSearch = !search || appointment.patientName.toLowerCase().includes(search.toLowerCase()) || appointment.reason.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusTabs: { id: Status; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Appointments</h1>
        <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Approve requests, complete consultations, and monitor payment state.</p>
      </div>

      <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by patient name or reason..." className="flex-1 outline-none bg-transparent text-gray-700" style={{ fontSize: '0.9rem' }} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map((tab) => (
          <button key={tab.id} onClick={() => setFilterStatus(tab.id)} className={`flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-xl border transition-all ${filterStatus === tab.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`} style={{ fontWeight: 600, fontSize: '0.85rem' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Patient', 'Date & Time', 'Reason', 'Payment', 'Status', 'Actions'].map((heading) => (
                  <th key={heading} className="text-left px-5 py-3.5 text-gray-500" style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((appointment) => {
                const style = statusConfig[appointment.status];
                return (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-gray-900" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{appointment.patientName}</p>
                      <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>Age {appointment.patientAge}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-800" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{appointment.date}</p>
                      <p className="text-gray-400 flex items-center gap-1 mt-0.5" style={{ fontSize: '0.78rem' }}><Clock size={12} /> {appointment.time}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600" style={{ fontSize: '0.85rem' }}>{appointment.reason}</td>
                    <td className="px-5 py-4"><span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 capitalize" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{appointment.paymentStatus.replace('_', ' ')}</span></td>
                    <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full ${style.bg} ${style.text}`} style={{ fontSize: '0.75rem', fontWeight: 700 }}>{style.label}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedAppointment(appointment)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"><Eye size={16} /></button>
                        {appointment.status === 'pending' && (
                          <>
                            <button onClick={() => void updateAppointmentStatus(appointment.id, 'confirmed')} className="p-2 rounded-lg text-green-400 hover:bg-green-50 hover:text-green-600 transition-colors"><CheckCircle size={16} /></button>
                            <button onClick={() => void updateAppointmentStatus(appointment.id, 'cancelled')} className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"><XCircle size={16} /></button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button onClick={() => void updateAppointmentStatus(appointment.id, 'completed')} className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                            Mark Done
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Calendar size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">No appointments found</p>
            </div>
          )}
        </div>
      </div>

      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedAppointment(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-500 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Appointment Details</h3>
                <button onClick={() => setSelectedAppointment(null)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30">✕</button>
              </div>
              <p className="text-white" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedAppointment.patientName}</p>
              <p className="text-white/70" style={{ fontSize: '0.85rem' }}>{selectedAppointment.specialty}</p>
            </div>
            <div className="p-6 space-y-4">
              {[{ label: 'Date', value: selectedAppointment.date }, { label: 'Time', value: selectedAppointment.time }, { label: 'Reason', value: selectedAppointment.reason }, { label: 'Payment', value: selectedAppointment.paymentStatus.replace('_', ' ') }, { label: 'Queue', value: selectedAppointment.queueNumber ? `#${selectedAppointment.queueNumber}` : 'Not assigned' }].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500" style={{ fontSize: '0.85rem' }}>{item.label}</span>
                  <span className="text-gray-900" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

