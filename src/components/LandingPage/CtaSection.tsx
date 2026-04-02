import { useNavigate } from 'react-router';
import { Phone } from 'lucide-react';

const CtaSection = () => {
			const navigate = useNavigate()
			{/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-white mb-4" style={{ fontSize: '2.5rem', fontWeight: 800 }}>Ready to Take Control of Your Health?</h2>
          <p className="text-blue-100 mb-10" style={{ fontSize: '1.125rem' }}>Join thousands of patients who trust MediBook for their healthcare needs. Sign up today — it's free!</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/login')} className="px-10 py-4 bg-white text-blue-600 rounded-2xl hover:shadow-xl transition-all" style={{ fontWeight: 700, fontSize: '1rem' }}>
              Book an Appointment
            </button>
            <button onClick={() => navigate('/login')} className="px-10 py-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2" style={{ fontWeight: 600, fontSize: '1rem' }}>
              <Phone size={18} /> Talk to Us
            </button>
          </div>
        </div>
      </section>

}

export default CtaSection
      