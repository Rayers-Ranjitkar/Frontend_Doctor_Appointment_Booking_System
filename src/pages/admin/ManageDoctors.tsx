import { useMemo, useState } from 'react';
import { Eye, MapPin, Plus, Search, Star } from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { useAuth } from '@/constants/AuthContext';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const defaultSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'];

export default function ManageDoctors() {
  const { doctors, specialties, reloadClinic } = useClinic();
  const { createDoctor } = useAuth();
  const [search, setSearch] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    specialty: 'Cardiology',
    specialtyId: 'sp1',
    experience: '5',
    price: '800',
    licenseNumber: '',
    about: '',
    education: '',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00 AM', '09:30 AM', '10:00 AM'],
  });

  const filtered = useMemo(() => doctors.filter((doctor) => {
    const matchesSearch = !search || [doctor.name, doctor.specialty, doctor.hospital].some((value) => value.toLowerCase().includes(search.toLowerCase()));
    const matchesSpecialty = !filterSpecialty || doctor.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  }), [doctors, search, filterSpecialty]);

  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) || null;

  const submit = async () => {
    const specialty = specialties.find((item) => item.name === form.specialty);
    const result = await createDoctor({
      ...form,
      specialtyId: specialty?.id || form.specialtyId,
    });
    if (!result.ok) {
      setMessage(result.error || 'Unable to create doctor account.');
      return;
    }
    await reloadClinic();
    setShowAddModal(false);
    setMessage('Doctor account created successfully.');
    setForm({
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      specialty: 'Cardiology',
      specialtyId: 'sp1',
      experience: '5',
      price: '800',
      licenseNumber: '',
      about: '',
      education: '',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timeSlots: ['09:00 AM', '09:30 AM', '10:00 AM'],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage Doctors</h1>
          <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>{doctors.length} doctors stored in the system.</p>
        </div>
        <button onClick={() => { setShowAddModal(true); setMessage(''); }} className="self-start flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-xl hover:shadow-lg transition-all" style={{ fontWeight: 600 }}>
          <Plus size={18} /> Create Doctor Account
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search doctors..." className="flex-1 outline-none bg-transparent text-gray-700" style={{ fontSize: '0.9rem' }} />
        </div>
        <select value={filterSpecialty} onChange={(event) => setFilterSpecialty(event.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-600 outline-none" style={{ fontSize: '0.9rem' }}>
          <option value="">All Specialties</option>
          {specialties.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
        </select>
      </div>

      {message ? <div className="rounded-2xl bg-blue-50 text-blue-700 px-4 py-3" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{message}</div> : null}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="relative h-40 overflow-hidden">
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${doctor.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                  {doctor.status}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 rounded-full px-2.5 py-1">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{doctor.rating}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-gray-900 mb-0.5" style={{ fontWeight: 700, fontSize: '0.95rem' }}>{doctor.name}</h3>
              <p className="text-purple-600 mb-1" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{doctor.specialty}</p>
              <p className="text-gray-400 flex items-center gap-1 mb-3" style={{ fontSize: '0.78rem' }}>
                <MapPin size={11} /> {doctor.hospital}
              </p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500" style={{ fontSize: '0.78rem' }}>{doctor.patients.toLocaleString()} patients</span>
                <span className="text-gray-900" style={{ fontSize: '0.85rem', fontWeight: 700 }}>NPR {doctor.price}/visit</span>
              </div>
              <button onClick={() => setSelectedDoctorId(doctor.id)} className="w-full flex items-center justify-center gap-1.5 py-2 text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                <Eye size={14} /> View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedDoctorId(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
            <div className="relative h-52 overflow-hidden rounded-t-3xl">
              <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button onClick={() => setSelectedDoctorId(null)} className="absolute top-4 right-4 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">✕</button>
              <div className="absolute bottom-4 left-5">
                <h2 className="text-white mb-0.5" style={{ fontSize: '1.3rem', fontWeight: 800 }}>{selectedDoctor.name}</h2>
                <p className="text-purple-300" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{selectedDoctor.specialty}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[{ l: 'Experience', v: `${selectedDoctor.experience}yrs` }, { l: 'Patients', v: selectedDoctor.patients.toLocaleString() }, { l: 'Rating', v: `${selectedDoctor.rating}★` }].map((item) => (
                  <div key={item.l} className="bg-purple-50 rounded-xl p-3 text-center">
                    <p className="text-purple-700" style={{ fontWeight: 800, fontSize: '1rem' }}>{item.v}</p>
                    <p className="text-purple-400" style={{ fontSize: '0.72rem' }}>{item.l}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-gray-700" style={{ fontSize: '0.88rem' }}>
                <p><strong>Email login:</strong> use the credential created for this doctor.</p>
                <p><strong>Hospital:</strong> {selectedDoctor.hospital}</p>
                <p><strong>Verification:</strong> {selectedDoctor.verificationStatus}</p>
                <p><strong>Available days:</strong> {selectedDoctor.availableDays.join(', ') || 'Not set'}</p>
                <p><strong>Slots:</strong> {selectedDoctor.timeSlots.join(', ') || 'Not set'}</p>
                <p><strong>About:</strong> {selectedDoctor.about}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900" style={{ fontSize: '1.15rem', fontWeight: 700 }}>Create Doctor Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Full name" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <input value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} placeholder="Username" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Temporary password" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <input value={form.licenseNumber} onChange={(event) => setForm((current) => ({ ...current, licenseNumber: event.target.value }))} placeholder="License number" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <select value={form.specialty} onChange={(event) => setForm((current) => ({ ...current, specialty: event.target.value, specialtyId: specialties.find((item) => item.name === event.target.value)?.id || '' }))} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none">
                {specialties.map((item) => <option key={item.id}>{item.name}</option>)}
              </select>
              <input value={form.experience} onChange={(event) => setForm((current) => ({ ...current, experience: event.target.value }))} placeholder="Experience in years" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <input value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} placeholder="Consultation fee" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
            </div>
            <textarea value={form.about} onChange={(event) => setForm((current) => ({ ...current, about: event.target.value }))} placeholder="Short doctor bio" rows={3} className="mt-4 w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none" />
            <textarea value={form.education} onChange={(event) => setForm((current) => ({ ...current, education: event.target.value }))} placeholder="Education, one item per line" rows={3} className="mt-4 w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none" />
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-gray-500 mb-3" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Available Days</p>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setForm((current) => ({
                        ...current,
                        availableDays: current.availableDays.includes(day)
                          ? current.availableDays.filter((item) => item !== day)
                          : [...current.availableDays, day],
                      }))}
                      className={`px-3 py-2 rounded-full ${form.availableDays.includes(day) ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
                      style={{ fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-gray-500 mb-3" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Time Slots</p>
                <div className="flex flex-wrap gap-2">
                  {defaultSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm((current) => ({
                        ...current,
                        timeSlots: current.timeSlots.includes(slot)
                          ? current.timeSlots.filter((item) => item !== slot)
                          : [...current.timeSlots, slot],
                      }))}
                      className={`px-3 py-2 rounded-full ${form.timeSlots.includes(slot) ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
                      style={{ fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600" style={{ fontWeight: 600 }}>Cancel</button>
              <button onClick={() => void submit()} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-xl hover:shadow-md" style={{ fontWeight: 600 }}>Create Doctor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
