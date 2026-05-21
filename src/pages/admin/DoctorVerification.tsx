import { useClinic } from '../../context/ClinicContext';

export default function DoctorVerification() {
  const { doctors, updateDoctorVerification } = useClinic();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Doctor Verification</h1>
        <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Review license information and approve or reject doctor onboarding records.</p>
      </div>

      <div className="grid gap-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <p className="text-gray-900" style={{ fontWeight: 700 }}>{doctor.name}</p>
                <p className="text-gray-500" style={{ fontSize: '0.82rem' }}>{doctor.specialty} • {doctor.hospital}</p>
                <p className="text-gray-400 mt-1" style={{ fontSize: '0.8rem' }}>License: {doctor.licenseNumber}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full capitalize ${doctor.verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-700' : doctor.verificationStatus === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`} style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                  {doctor.verificationStatus}
                </span>
                <button onClick={() => void updateDoctorVerification(doctor.id, 'verified')} className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Approve</button>
                <button onClick={() => void updateDoctorVerification(doctor.id, 'rejected')} className="px-4 py-2 rounded-xl bg-red-50 text-red-700" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
