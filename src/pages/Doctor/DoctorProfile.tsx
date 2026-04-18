import { useState } from 'react';
import { Award, KeyRound, Mail, MapPin, Phone, Star, Users } from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { useAuth } from '@/constants/AuthContext';

export default function DoctorProfile() {
  const { currentDoctor } = useClinic();
  const { user, changePassword } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');

  const submitPasswordChange = async () => {
    setMessage('');
    const result = await changePassword(passwordForm);
    if (!result.ok) {
      setMessage(result.error || 'Unable to change password.');
      return;
    }
    setPasswordForm({ currentPassword: '', newPassword: '' });
    setMessage('Password updated successfully.');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Profile</h1>
        <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Professional details and doctor account security.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-br from-emerald-500 to-teal-600" />
          <div className="px-6 pb-6">
            <div className="-mt-12 mb-4">
              <img src={currentDoctor.image} alt={currentDoctor.name} className="w-24 h-24 rounded-2xl object-cover object-top border-4 border-white shadow-lg" />
            </div>
            <h2 className="text-gray-900 mb-0.5" style={{ fontSize: '1.15rem', fontWeight: 700 }}>{currentDoctor.name}</h2>
            <p className="text-emerald-600 mb-4" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{currentDoctor.specialty}</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Rating', value: `${currentDoctor.rating}★` },
                { label: 'Patients', value: `${currentDoctor.patients}` },
                { label: 'Reviews', value: currentDoctor.reviews },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-gray-900" style={{ fontWeight: 800, fontSize: '1rem' }}>{item.value}</p>
                  <p className="text-gray-400" style={{ fontSize: '0.7rem' }}>{item.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-emerald-500" />
                </div>
                <p className="text-gray-600 truncate" style={{ fontSize: '0.82rem' }}>{currentDoctor.hospital}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-blue-500" />
                </div>
                <p className="text-gray-600 truncate" style={{ fontSize: '0.82rem' }}>{user?.email || 'Not available'}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-purple-500" />
                </div>
                <p className="text-gray-600" style={{ fontSize: '0.82rem' }}>{user?.phone || 'Not available'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-gray-900 mb-5" style={{ fontWeight: 700, fontSize: '1rem' }}>Professional Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ['Full Name', currentDoctor.name],
                ['Specialty', currentDoctor.specialty],
                ['Hospital', currentDoctor.hospital],
                ['Experience', `${currentDoctor.experience} years`],
                ['Consultation Fee', `NPR ${currentDoctor.price}`],
                ['License Number', currentDoctor.licenseNumber],
                ['Verification', currentDoctor.verificationStatus],
              ].map(([label, value]) => (
                <div key={label}>
                  <label className="block text-gray-400 mb-1.5" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                  <p className="text-gray-800" style={{ fontSize: '0.92rem', fontWeight: 500 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-gray-900 mb-4" style={{ fontWeight: 700, fontSize: '1rem' }}>About</h3>
            <p className="text-gray-600" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{currentDoctor.about}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2" style={{ fontWeight: 700, fontSize: '1rem' }}>
              <Award size={18} className="text-emerald-500" /> Education & Training
            </h3>
            <div className="space-y-3">
              {currentDoctor.education.map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-600" style={{ fontWeight: 800, fontSize: '0.78rem' }}>{index + 1}</span>
                  </div>
                  <p className="text-gray-700" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-gray-900 mb-5 flex items-center gap-2" style={{ fontWeight: 700, fontSize: '1rem' }}>
              <KeyRound size={18} className="text-amber-500" /> Change Password
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
                placeholder="Current password"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-400"
              />
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
                placeholder="New password"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-400"
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button onClick={() => void submitPasswordChange()} className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white" style={{ fontWeight: 600 }}>
                Update Password
              </button>
              {message ? <p className="text-gray-600" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{message}</p> : null}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-gray-900 mb-5 flex items-center gap-2" style={{ fontWeight: 700, fontSize: '1rem' }}>
              <Star size={18} className="text-amber-400" /> Rating Snapshot
            </h3>
            <div className="flex gap-8 items-center">
              <div className="text-center">
                <p className="text-gray-900" style={{ fontSize: '3rem', fontWeight: 900 }}>{currentDoctor.rating}</p>
                <p className="text-gray-400" style={{ fontSize: '0.78rem' }}>{currentDoctor.reviews} reviews</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 flex-1">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-900" style={{ fontWeight: 800, fontSize: '1.1rem' }}>{currentDoctor.patients}</p>
                  <p className="text-gray-400" style={{ fontSize: '0.78rem' }}>Patients Served</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-900" style={{ fontWeight: 800, fontSize: '1.1rem' }}>{currentDoctor.availableDays.length}</p>
                  <p className="text-gray-400" style={{ fontSize: '0.78rem' }}>Active Clinic Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

