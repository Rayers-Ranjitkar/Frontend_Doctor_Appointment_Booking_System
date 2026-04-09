import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Star, MapPin, Filter,  X, Clock, Award } from 'lucide-react';
import { doctors, specialties } from '@/utils/mockData';

export default function SearchDoctors() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [minExperience, setMinExperience] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);

  const hospitals = [...new Set(doctors.map(d => d.hospital))];

  const filtered = doctors
    .filter(d => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.hospital.toLowerCase().includes(q);
      const matchesSpecialty = !selectedSpecialty || d.specialty === selectedSpecialty;
      const matchesHospital = !selectedHospital || d.hospital === selectedHospital;
      const matchesExp = d.experience >= minExperience;
      const matchesRating = d.rating >= minRating;
      return matchesSearch && matchesSpecialty && matchesHospital && matchesExp && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experience - a.experience;
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Find a Doctor</h1>
        <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Search from our network of verified specialists</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={20} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search doctors, specialties, hospitals..."
            className="flex-1 outline-none bg-transparent text-gray-700"
            style={{ fontSize: '0.95rem' }}
          />
          {searchQuery && <button onClick={() => setSearchQuery('')}><X size={16} className="text-gray-400 hover:text-gray-700" /></button>}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* Specialty Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={() => setSelectedSpecialty('')} className={`shrink-0 px-4 py-2 rounded-full border transition-all ${!selectedSpecialty ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`} style={{ fontSize: '0.82rem', fontWeight: 600 }}>
          All Specialties
        </button>
        {specialties.map(s => (
          <button key={s.id} onClick={() => setSelectedSpecialty(s.name === selectedSpecialty ? '' : s.name)} className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all ${selectedSpecialty === s.name ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`} style={{ fontSize: '0.82rem', fontWeight: 600 }}>
            <span>{s.icon}</span> {s.name}
          </button>
        ))}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-gray-700 mb-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hospital</label>
            <select value={selectedHospital} onChange={e => setSelectedHospital(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 outline-none" style={{ fontSize: '0.85rem' }}>
              <option value="">All Hospitals</option>
              {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Min Experience: {minExperience}+ yrs</label>
            <input type="range" min={0} max={20} value={minExperience} onChange={e => setMinExperience(Number(e.target.value))} className="w-full accent-blue-600" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Min Rating: {minRating}+</label>
            <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="w-full accent-blue-600" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 outline-none" style={{ fontSize: '0.85rem' }}>
              <option value="rating">Highest Rating</option>
              <option value="experience">Most Experienced</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600" style={{ fontSize: '0.9rem' }}>
          <span style={{ fontWeight: 700 }}>{filtered.length}</span> doctors found
          {selectedSpecialty && <span className="text-blue-600"> in {selectedSpecialty}</span>}
        </p>
      </div>

      {/* Doctor Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
            <div className="relative h-48 overflow-hidden">
              <img src={doc.image} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{doc.rating}</span>
                <span className="text-gray-500" style={{ fontSize: '0.75rem' }}>({doc.reviews})</span>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-white" style={{ fontSize: '0.75rem' }}>Available</span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-gray-900 mb-0.5" style={{ fontWeight: 700, fontSize: '1rem' }}>{doc.name}</h3>
              <p className="text-blue-600 mb-1" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{doc.specialty}</p>
              <p className="text-gray-400 flex items-center gap-1 mb-4" style={{ fontSize: '0.8rem' }}>
                <MapPin size={12} /> {doc.hospital}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: '0.8rem' }}>
                  <Award size={14} className="text-blue-400" />
                  <span>{doc.experience} yrs exp</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: '0.8rem' }}>
                  <Clock size={14} className="text-green-400" />
                  <span>{doc.availableDays.length} days/week</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-gray-400" style={{ fontSize: '0.72rem' }}>Consultation Fee</p>
                  <p className="text-gray-900" style={{ fontWeight: 800, fontSize: '1.1rem' }}>${doc.price}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedDoctor(doc)} className="px-4 py-2 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Details
                  </button>
                  <button onClick={() => navigate(`/patient/book/${doc.id}`)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-md transition-all" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Search size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400" style={{ fontSize: '1.1rem' }}>No doctors found matching your criteria</p>
          <button onClick={() => { setSearchQuery(''); setSelectedSpecialty(''); setSelectedHospital(''); setMinExperience(0); setMinRating(0); }} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl" style={{ fontSize: '0.85rem' }}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedDoctor(null)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative h-56 overflow-hidden rounded-t-3xl">
              <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button onClick={() => setSelectedDoctor(null)} className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30">
                <X size={18} />
              </button>
              <div className="absolute bottom-4 left-6">
                <h2 className="text-white mb-1" style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedDoctor.name}</h2>
                <p className="text-blue-300" style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedDoctor.specialty}</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Experience', value: `${selectedDoctor.experience} yrs` },
                  { label: 'Patients', value: selectedDoctor.patients.toLocaleString() },
                  { label: 'Rating', value: `${selectedDoctor.rating} ★` },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-gray-900" style={{ fontWeight: 800, fontSize: '1.1rem' }}>{s.value}</p>
                    <p className="text-gray-500" style={{ fontSize: '0.75rem' }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>About</h4>
                <p className="text-gray-500" style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>{selectedDoctor.about}</p>
              </div>
              <div>
                <h4 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>Education</h4>
                <ul className="space-y-1">
                  {selectedDoctor.education.map((e, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-500" style={{ fontSize: '0.85rem' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" /> {e}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>Available Days</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.availableDays.map(day => (
                    <span key={day} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{day}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-gray-400" style={{ fontSize: '0.8rem' }}>Consultation Fee</p>
                  <p className="text-gray-900" style={{ fontWeight: 800, fontSize: '1.3rem' }}>${selectedDoctor.price}</p>
                </div>
                <button onClick={() => { setSelectedDoctor(null); navigate(`/patient/book/${selectedDoctor.id}`); }} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all" style={{ fontWeight: 700 }}>
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

