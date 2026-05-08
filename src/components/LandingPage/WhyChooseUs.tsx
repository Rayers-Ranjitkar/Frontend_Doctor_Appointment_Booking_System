import { Search, Star, Shield, Clock, } from 'lucide-react';

const consultImage = 'https://images.unsplash.com/photo-1758691461957-474a7686e388?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80';
const WhyChooseUs = () => {
  return (

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-blue-600 mb-3" style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Why Choose Us</p>
              <h2 className="text-gray-900 mb-6" style={{ fontSize: '2.25rem', fontWeight: 800 }}>Healthcare Made Simple & Accessible</h2>
              <p className="text-gray-500 mb-10">MediBook connects you with certified doctors, streamlines appointment booking, and ensures you get the care you need — all in one platform.</p>
              <div className="space-y-6">
                {[
                  { icon: Search, title: 'Find the Right Doctor', desc: 'Filter by specialty, hospital, rating, and availability to find your perfect match.', color: 'blue' },
                  { icon: Clock, title: 'Real-Time Scheduling', desc: 'View live availability and book instantly. No waiting, no phone calls.', color: 'cyan' },
                  { icon: Shield, title: 'Secure & Private', desc: 'Your medical data is encrypted and protected with enterprise-grade security.', color: 'emerald' },
                  { icon: Star, title: 'Verified Reviews', desc: 'Read authentic patient reviews and ratings to make informed decisions.', color: 'amber' },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      feature.color === 'cyan' ? 'bg-cyan-100 text-cyan-600' :
                      feature.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      <feature.icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-gray-900 mb-1" style={{ fontSize: '1rem', fontWeight: 700 }}>{feature.title}</h3>
                      <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={consultImage} alt="Medical Consultation" className="w-full h-125 object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <span className="text-2xl"> </span>
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontWeight: 700, fontSize: '1rem' }}>Appointment Confirmed!</p>
                  <p className="text-gray-500" style={{ fontSize: '0.8rem' }}>Dr. Wilson — March 20 at 10:00 AM</p>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-5">
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-900" style={{ fontWeight: 700, fontSize: '0.9rem' }}>4.9/5 Rating</p>
                <p className="text-gray-500" style={{ fontSize: '0.75rem' }}>Based on 10,000+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

  )
}

export default WhyChooseUs