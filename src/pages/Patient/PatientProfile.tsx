import { Calendar, Droplets, Mail, MapPin, Phone, User } from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { useAuth } from '@/constants/AuthContext';

export default function PatientProfile() {
  const { currentPatient, appointments } = useClinic();
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Profile</h1>
        <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Your patient account and stored medical basics.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-4 shadow-lg">
            <User size={40} className="text-white" />
          </div>
          <h2 className="text-gray-900 mb-1" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{currentPatient.name}</h2>
          <p className="text-blue-600 mb-1" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Patient</p>
          <p className="text-gray-400 mb-5" style={{ fontSize: '0.8rem' }}>Patient ID: {currentPatient.id.toUpperCase()}</p>
          <div className="w-full grid grid-cols-2 gap-3">
            {[
              { label: 'Age', value: `${currentPatient.age} yrs` },
              { label: 'Blood Type', value: currentPatient.bloodGroup || '-' },
              { label: 'Gender', value: currentPatient.gender || '-' },
              { label: 'Appointments', value: String(appointments.filter((item) => item.patientId === currentPatient.id).length) },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-900" style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.value}</p>
                <p className="text-gray-400" style={{ fontSize: '0.72rem' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-gray-900 mb-5" style={{ fontWeight: 700, fontSize: '1rem' }}>Account Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: currentPatient.name },
                { label: 'Joined Date', value: currentPatient.joinedDate || '-' },
                { label: 'Username', value: user?.username || '-' },
                { label: 'Email', value: currentPatient.email || user?.email || '-' },
                { label: 'Phone', value: currentPatient.phone || user?.phone || '-' },
                { label: 'Address', value: currentPatient.address || '-', full: true },
              ].map((field) => (
                <div key={field.label} className={field.full ? 'sm:col-span-2' : ''}>
                  <label className="block text-gray-500 mb-1.5" style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</label>
                  <p className="text-gray-800" style={{ fontSize: '0.92rem', fontWeight: 500 }}>{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-gray-900 mb-5" style={{ fontWeight: 700, fontSize: '1rem' }}>Medical Basics</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-500 mb-1.5" style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Known Allergies</label>
                <p className="text-gray-800" style={{ fontSize: '0.92rem', fontWeight: 500 }}>{currentPatient.allergies.join(', ') || 'None'}</p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1.5" style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Existing Conditions</label>
                <p className="text-gray-800" style={{ fontSize: '0.92rem', fontWeight: 500 }}>{currentPatient.conditions.join(', ') || 'None'}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { icon: Mail, label: 'Email', value: currentPatient.email || '-' },
                { icon: Phone, label: 'Phone', value: currentPatient.phone || '-' },
                { icon: Droplets, label: 'Blood Group', value: currentPatient.bloodGroup || '-' },
                { icon: MapPin, label: 'Address', value: currentPatient.address || '-' },
              ].map((card) => (
                <div key={card.label} className="bg-gray-50 rounded-xl p-4">
                  <card.icon size={16} className="text-blue-500 mb-2" />
                  <p className="text-gray-400" style={{ fontSize: '0.72rem' }}>{card.label}</p>
                  <p className="text-gray-900 mt-1" style={{ fontWeight: 700, fontSize: '0.88rem' }}>{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-gray-900 mb-5 flex items-center gap-2" style={{ fontWeight: 700, fontSize: '1rem' }}>
              <Calendar size={18} className="text-blue-500" /> Activity Summary
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-blue-700" style={{ fontWeight: 800, fontSize: '1.1rem' }}>{appointments.filter((item) => item.patientId === currentPatient.id && item.status === 'confirmed').length}</p>
                <p className="text-blue-500" style={{ fontSize: '0.78rem' }}>Confirmed Appointments</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-emerald-700" style={{ fontWeight: 800, fontSize: '1.1rem' }}>{appointments.filter((item) => item.patientId === currentPatient.id && item.status === 'completed').length}</p>
                <p className="text-emerald-500" style={{ fontSize: '0.78rem' }}>Completed Visits</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-amber-700" style={{ fontWeight: 800, fontSize: '1.1rem' }}>{appointments.filter((item) => item.patientId === currentPatient.id && item.status === 'pending').length}</p>
                <p className="text-amber-500" style={{ fontSize: '0.78rem' }}>Pending Requests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
