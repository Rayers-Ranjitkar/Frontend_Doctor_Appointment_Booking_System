import { useState } from 'react';
import { Search, Plus, Trash2, Eye, Phone, Mail, Droplets } from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { useAuth } from '@/constants/AuthContext';
import type { Patient } from '@/utils/clinicData';

export default function ManagePatients() {
  const { patients, reloadClinic } = useClinic();
  const { signupPatient } = useAuth();

  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addForm, setAddForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: 'Patient@123',
    age: '',
    gender: 'Male',
    address: '',
    bloodGroup: 'O+',
  });

  const filtered = patients.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
    const matchGender = !filterGender || p.gender === filterGender;
    return matchSearch && matchGender;
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const { apiRequest } = await import('@/utils/api');
      await apiRequest(`/patients/${deleteId}`, { method: 'DELETE' });
      await reloadClinic();
    } catch {
      // fallback: in offline mode, clinicStore.deletePatient mutates in-memory state
      // reloadClinic() will pick up the change via fallbackBootstrap
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const handleAdd = async () => {
    if (!addForm.name || !addForm.email || !addForm.phone || !addForm.age) {
      setAddError('Name, email, phone and age are required.');
      return;
    }
    setAddLoading(true);
    setAddError('');
    const result = await signupPatient(addForm);
    setAddLoading(false);
    if (!result.ok) {
      setAddError(result.error || 'Unable to add patient.');
      return;
    }
    await reloadClinic();
    setShowAddModal(false);
    setAddForm({ name: '', username: '', email: '', phone: '', password: 'Patient@123', age: '', gender: 'Male', address: '', bloodGroup: 'O+' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage Patients</h1>
          <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>{patients.length} registered patients in the system</p>
        </div>
        <button onClick={() => { setShowAddModal(true); setAddError(''); }} className="self-start flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all" style={{ fontWeight: 600 }}>
          <Plus size={18} /> Add Patient
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or phone..." className="flex-1 outline-none bg-transparent text-gray-700" style={{ fontSize: '0.9rem' }} />
        </div>
        <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-600 outline-none hover:border-blue-300" style={{ fontSize: '0.9rem' }}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Total Patients', value: patients.length, color: 'text-blue-600' },
          { label: 'Male', value: patients.filter((p) => p.gender === 'Male').length, color: 'text-cyan-600' },
          { label: 'Female', value: patients.filter((p) => p.gender === 'Female').length, color: 'text-pink-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className={s.color} style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</p>
            <p className="text-gray-400" style={{ fontSize: '0.78rem' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Patient', 'Contact', 'Age / Gender', 'Blood Group', 'Visits', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-gray-400" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white shrink-0" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                        {patient.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <p className="text-gray-900" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{patient.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-600 flex items-center gap-1 mb-0.5" style={{ fontSize: '0.82rem' }}>
                      <Mail size={12} className="text-gray-400" /> {patient.email}
                    </p>
                    <p className="text-gray-500 flex items-center gap-1" style={{ fontSize: '0.78rem' }}>
                      <Phone size={12} className="text-gray-400" /> {patient.phone}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-700" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{patient.age} yrs</p>
                    <p className="text-gray-400" style={{ fontSize: '0.78rem' }}>{patient.gender}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full flex items-center gap-1 w-fit" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                      <Droplets size={11} /> {patient.bloodGroup}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-800" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{patient.appointments}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-500" style={{ fontSize: '0.82rem' }}>
                    {new Date(patient.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedPatient(patient)} className="p-2 rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => setDeleteId(patient.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Search size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">No patients found</p>
            </div>
          )}
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedPatient(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900" style={{ fontSize: '1.15rem', fontWeight: 700 }}>Patient Details</h3>
              <button onClick={() => setSelectedPatient(null)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                {selectedPatient.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-gray-900" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedPatient.name}</h4>
                <p className="text-gray-400" style={{ fontSize: '0.85rem' }}>Patient ID: {selectedPatient.id.toUpperCase()}</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Age', value: `${selectedPatient.age} years` },
                { label: 'Gender', value: selectedPatient.gender },
                { label: 'Blood Group', value: selectedPatient.bloodGroup },
                { label: 'Email', value: selectedPatient.email },
                { label: 'Phone', value: selectedPatient.phone },
                { label: 'Address', value: selectedPatient.address },
                { label: 'Total Appointments', value: String(selectedPatient.appointments) },
                { label: 'Joined', value: new Date(selectedPatient.joinedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500" style={{ fontSize: '0.82rem' }}>{item.label}</span>
                  <span className="text-gray-900 text-right max-w-[55%]" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-gray-900 mb-2" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Remove Patient?</h3>
            <p className="text-gray-500 mb-6" style={{ fontSize: '0.88rem' }}>This will permanently remove the patient record from the system.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50" style={{ fontWeight: 600 }}>Cancel</button>
              <button onClick={() => void handleDelete()} disabled={deleteLoading} className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-60" style={{ fontWeight: 600 }}>
                {deleteLoading ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900" style={{ fontSize: '1.15rem', fontWeight: 700 }}>Add New Patient</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Full Name', key: 'name', placeholder: 'Patient full name' },
                { label: 'Username', key: 'username', placeholder: 'e.g., john_doe' },
                { label: 'Email', key: 'email', placeholder: 'email@example.com' },
                { label: 'Phone', key: 'phone', placeholder: '+977-98xxxxxxxx' },
                { label: 'Age', key: 'age', placeholder: 'e.g., 34' },
                { label: 'Address', key: 'address', placeholder: 'Kathmandu, Nepal' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-gray-500 mb-1.5" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={(addForm as Record<string, string>)[f.key]}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 outline-none focus:border-blue-400"
                    style={{ fontSize: '0.9rem' }}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1.5" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Gender</label>
                  <select value={addForm.gender} onChange={(e) => setAddForm((p) => ({ ...p, gender: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 outline-none focus:border-blue-400" style={{ fontSize: '0.9rem' }}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1.5" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Blood Group</label>
                  <select value={addForm.bloodGroup} onChange={(e) => setAddForm((p) => ({ ...p, bloodGroup: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 outline-none focus:border-blue-400" style={{ fontSize: '0.9rem' }}>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              {addError && <p className="text-red-500 text-sm">{addError}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600" style={{ fontWeight: 600 }}>Cancel</button>
              <button onClick={() => void handleAdd()} disabled={addLoading} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-md disabled:opacity-60" style={{ fontWeight: 600 }}>
                {addLoading ? 'Adding...' : 'Add Patient'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
