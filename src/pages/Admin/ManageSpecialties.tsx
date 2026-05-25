import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Search } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import type { Specialty } from '@/utils/clinicData';
import { apiRequest } from '@/utils/api';

export default function ManageSpecialties() {
  const { specialties, reloadClinic } = useClinic();

  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Specialty>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newSpec, setNewSpec] = useState({ name: '', icon: '🏥', color: '#3B82F6', doctorCount: 0 });

  const filtered = specialties.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (spec: Specialty) => {
    setEditingId(spec.id);
    setEditForm({ name: spec.name, icon: spec.icon, color: spec.color, doctorCount: spec.doctorCount });
  };

  const handleSaveEdit = async (id: string) => {
    setSaving(true);
    try {
      await apiRequest(`/specialties/${id}`, { method: 'PATCH', body: JSON.stringify(editForm) });
    } catch { /* offline: clinicStore.updateSpecialty applied via ClinicContext action */ }
    await reloadClinic();
    setSaving(false);
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    try {
      await apiRequest(`/specialties/${deleteId}`, { method: 'DELETE' });
    } catch { /* offline fallback */ }
    await reloadClinic();
    setSaving(false);
    setDeleteId(null);
  };

  const handleAdd = async () => {
    if (!newSpec.name) return;
    setSaving(true);
    try {
      await apiRequest('/specialties', { method: 'POST', body: JSON.stringify(newSpec) });
    } catch { /* offline fallback */ }
    await reloadClinic();
    setSaving(false);
    setNewSpec({ name: '', icon: '🏥', color: '#3B82F6', doctorCount: 0 });
    setShowAddModal(false);
  };

  const EMOJI_OPTIONS = ['❤️', '🧠', '🦴', '👶', '🩺', '🏥', '👁️', '🧘', '💪', '🦷', '🫀', '🩻', '💊', '🔬', '🩹'];
  const COLOR_OPTIONS = ['#EF4444', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899', '#3B82F6', '#06B6D4', '#6366F1', '#F97316', '#14B8A6'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage Specialties</h1>
          <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>{specialties.length} medical specialties configured</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="self-start flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-xl hover:shadow-lg transition-all" style={{ fontWeight: 600 }}>
          <Plus size={18} /> Add Specialty
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 max-w-sm focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search specialties..." className="flex-1 outline-none bg-transparent text-gray-700" style={{ fontSize: '0.9rem' }} />
      </div>

      {/* Specialties Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((spec) => (
          <div key={spec.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
            {editingId === spec.id ? (
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: '1.5rem' }}>{editForm.icon}</span>
                  <input type="text" value={editForm.name || ''} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-gray-700 outline-none focus:border-purple-400" style={{ fontSize: '0.9rem', fontWeight: 600 }} />
                </div>
                <div>
                  <p className="text-gray-400 mb-1.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>ICON</p>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((e) => (
                      <button key={e} onClick={() => setEditForm((f) => ({ ...f, icon: e }))} className={`w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors ${editForm.icon === e ? 'bg-purple-100 ring-2 ring-purple-400' : 'bg-gray-50'}`} style={{ fontSize: '1rem' }}>{e}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 mb-1.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>COLOR</p>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button key={c} onClick={() => setEditForm((f) => ({ ...f, color: c }))} className={`w-7 h-7 rounded-full transition-all ${editForm.color === c ? 'ring-2 ring-offset-2 ring-purple-400 scale-110' : ''}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 mb-1.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>DOCTORS</p>
                  <input type="number" value={editForm.doctorCount || 0} onChange={(e) => setEditForm((f) => ({ ...f, doctorCount: Number(e.target.value) }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-gray-700 outline-none focus:border-purple-400" style={{ fontSize: '0.88rem' }} />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => void handleSaveEdit(spec.id)} disabled={saving} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-60" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${spec.color}20` }}>
                    {spec.icon}
                  </div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: spec.color }} />
                </div>
                <h3 className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: '1rem' }}>{spec.name}</h3>
                <p className="text-gray-400 mb-4" style={{ fontSize: '0.82rem' }}>{spec.doctorCount} doctors</p>
                <div className="h-1.5 rounded-full mb-4" style={{ backgroundColor: `${spec.color}20` }}>
                  <div className="h-full rounded-full" style={{ backgroundColor: spec.color, width: `${Math.min(spec.doctorCount * 6, 100)}%` }} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(spec)} className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => setDeleteId(spec.id)} className="p-2 text-red-400 border border-red-100 rounded-xl hover:bg-red-50 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-gray-900 mb-2" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Delete Specialty?</h3>
            <p className="text-gray-500 mb-6" style={{ fontSize: '0.88rem' }}>This will remove the specialty from the system.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600" style={{ fontWeight: 600 }}>Cancel</button>
              <button onClick={() => void handleDelete()} disabled={saving} className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-60" style={{ fontWeight: 600 }}>
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Specialty Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900" style={{ fontSize: '1.15rem', fontWeight: 700 }}>Add New Specialty</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 mb-1.5" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Specialty Name</label>
                <input type="text" value={newSpec.name} onChange={(e) => setNewSpec((s) => ({ ...s, name: e.target.value }))} placeholder="e.g., Oncology" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 outline-none focus:border-purple-400" style={{ fontSize: '0.9rem' }} />
              </div>
              <div>
                <label className="block text-gray-500 mb-1.5" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Icon</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <button key={e} onClick={() => setNewSpec((s) => ({ ...s, icon: e }))} className={`w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors ${newSpec.icon === e ? 'bg-purple-100 ring-2 ring-purple-400' : 'bg-gray-50'}`} style={{ fontSize: '1.1rem' }}>{e}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-500 mb-1.5" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button key={c} onClick={() => setNewSpec((s) => ({ ...s, color: c }))} className={`w-8 h-8 rounded-full transition-all ${newSpec.color === c ? 'ring-2 ring-offset-2 ring-purple-400 scale-110' : ''}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-500 mb-1.5" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Number of Doctors</label>
                <input type="number" value={newSpec.doctorCount} onChange={(e) => setNewSpec((s) => ({ ...s, doctorCount: Number(e.target.value) }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 outline-none focus:border-purple-400" style={{ fontSize: '0.9rem' }} />
              </div>
              {newSpec.name && (
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: `${newSpec.color}15` }}>
                  <span style={{ fontSize: '1.5rem' }}>{newSpec.icon}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: newSpec.color }}>{newSpec.name}</p>
                    <p className="text-gray-500" style={{ fontSize: '0.75rem' }}>{newSpec.doctorCount} doctors</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600" style={{ fontWeight: 600 }}>Cancel</button>
              <button onClick={() => void handleAdd()} disabled={!newSpec.name || saving} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-xl hover:shadow-md disabled:opacity-50" style={{ fontWeight: 600 }}>
                {saving ? 'Adding...' : 'Add Specialty'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
