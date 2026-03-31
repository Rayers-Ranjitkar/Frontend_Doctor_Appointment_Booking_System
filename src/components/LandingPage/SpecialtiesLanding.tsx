import { useNavigate } from 'react-router';
import { specialties } from '@/utils/mockData';

const SpecialtiesLanding = () => {
  const navigate = useNavigate();
  return (

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 mb-3" style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Browse by Category</p>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: '2.25rem', fontWeight: 800 }}>Our Medical Specialties</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Find the right specialist for your health needs across a wide range of medical fields</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {specialties.map((spec) => (
              <button key={spec.id} onClick={() => navigate('/login')} className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-all group border border-gray-100 hover:border-blue-200">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${spec.color}15` }}>
                  {spec.icon}
                </div>
                <span className="text-gray-800 group-hover:text-blue-600 transition-colors" style={{ fontWeight: 600, fontSize: '0.95rem' }}>{spec.name}</span>
                <span className="text-gray-400" style={{ fontSize: '0.8rem' }}>{spec.doctorCount} Doctors</span>
              </button>
            ))}
          </div>
        </div>
      </section>

  )
}

export default SpecialtiesLanding