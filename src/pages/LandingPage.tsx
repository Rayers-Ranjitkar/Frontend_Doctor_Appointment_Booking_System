import NavBar from "@/components/LandingPage/NavBar"
import { useNavigate } from 'react-router';
import { Search,  MapPin, ArrowRight} from 'lucide-react';
import SpecialtiesLanding from "@/components/LandingPage/SpecialtiesLanding";
import WhyChooseUs from "@/components/LandingPage/WhyChooseUs";
import { doctors } from "@/utils/mockData"
import DoctorCard from "@/components/LandingPage/DoctorCard";

const heroImage = 'https://images.unsplash.com/photo-1769698678497-c41f0ab47c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80';
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <img src={heroImage} alt="Hospital" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-blue-950/90 via-blue-900/75 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white mb-6" style={{ fontSize: '0.85rem' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Trusted by 50,000+ patients worldwide
            </div>
            <h1 className="text-white mb-6" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.2 }}>
              Your Health, Our <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-300">Priority</span>
            </h1>
            <p className="text-blue-100 mb-10 max-w-xl" style={{ fontSize: '1.125rem', lineHeight: 1.75 }}>
              Book appointments with top doctors instantly. Find specialists near you, view real-time availability, and get quality healthcare at your fingertips.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row gap-3 mb-10">
              <div className="flex items-center gap-3 flex-1 px-3">
                <Search size={20} className="text-gray-400 shrink-0" />
                <input type="text" placeholder="Search doctors, specialties..." className="flex-1 outline-none text-gray-700 bg-transparent" style={{ fontSize: '0.95rem' }} />
              </div>
              <div className="flex items-center gap-3 flex-1 px-3 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0">
                <MapPin size={20} className="text-gray-400 shrink-0" />
                <input type="text" placeholder="Location..." className="flex-1 outline-none text-gray-700 bg-transparent" style={{ fontSize: '0.95rem' }} />
              </div>
              <button onClick={() => navigate('/login')} className="px-8 py-3 bg-linear-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all whitespace-nowrap" style={{ fontWeight: 600 }}>
                Find Doctors
              </button>
            </div>

            {/* Quick Specialty Tags */}
            <div className="flex flex-wrap gap-2">
              {['Cardiology', 'Neurology', 'Pediatrics', 'Dermatology', 'Orthopedics'].map((s) => (
                <button key={s} onClick={() => navigate('/login')} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all" style={{ fontSize: '0.8rem' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-t-3xl shadow-2xl p-6">
              {[
                { value: '500+', label: 'Expert Doctors', icon: '👨‍⚕️' },
                { value: '50K+', label: 'Happy Patients', icon: '😊' },
                { value: '20+', label: 'Specialties', icon: '🏥' },
                { value: '99%', label: 'Success Rate', icon: '⭐' },
              ].map((stat) => (
                <div key={stat.label} className="text-center py-2">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-gray-900 mb-0.5" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</div>
                  <div className="text-gray-500" style={{ fontSize: '0.8rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <SpecialtiesLanding />
      <WhyChooseUs />
      
      {/* Top Doctors */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-blue-600 mb-3" style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Our Specialists</p>
              <h2 className="text-gray-900" style={{ fontSize: '2.25rem', fontWeight: 800 }}>Meet Our Top Doctors</h2>
            </div>
            <button onClick={() => navigate('/login')} className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              View All Doctors <ArrowRight size={16} />
            </button>
          </div>
          <DoctorCard doctors={doctors}/>
        </div>
      </section>

      
    </div>
  )
}

export default LandingPage