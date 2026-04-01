import { Star,  MapPin, } from 'lucide-react';
import { useNavigate } from "react-router-dom";


export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  specialtyId: string;
  hospital: string;
  experience: number;
  rating: number;
  reviews: number;
  image: string;
  price: number;
  about: string;
  education: string[];
  availableDays: string[];
  timeSlots: string[];
  status: 'active' | 'inactive';
  patients: number;
};


type DoctorCardProps = {
    doctors: Doctor[];
}


const DoctorCard = ({doctors}: DoctorCardProps) => {
  const navigate = useNavigate()
  return (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all group border border-gray-100">
                <div className="relative h-52 overflow-hidden">
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-white" style={{ fontSize: '0.75rem' }}>Available Today</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{doctor.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: '1.05rem' }}>{doctor.name}</h3>
                  <p className="text-blue-600 mb-1" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{doctor.specialty}</p>
                  <p className="text-gray-400 mb-4 flex items-center gap-1" style={{ fontSize: '0.8rem' }}>
                    <MapPin size={12} /> {doctor.hospital}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-gray-400" style={{ fontSize: '0.75rem' }}>Consultation</span>
                      <p className="text-gray-900" style={{ fontWeight: 700, fontSize: '1rem' }}>${doctor.price}</p>
                    </div>
                    <button onClick={() => navigate('/login')} className="px-5 py-2 bg-linear-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-md transition-all" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
  )
}

export default DoctorCard