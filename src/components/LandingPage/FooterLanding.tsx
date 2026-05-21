import { Heart } from "lucide-react";

const FooterLanding = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <Heart size={14} className="text-white" />
                </div>
                <span className="text-white" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  MediBook
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>
                Your trusted healthcare companion. Book appointments, manage health records, and connect with specialists.
              </p>
            </div>

            {[
              { title: 'For Patients', links: ['Find a Doctor', 'Book Appointment', 'Health Records', 'Prescriptions'] },
              { title: 'For Doctors', links: ['Join Network', 'Manage Schedule', 'Patient Records', 'Analytics'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white mb-4" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {col.title}
                </h4>

                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-white transition-colors" style={{ fontSize: '0.85rem' }}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 text-center" style={{ fontSize: '0.8rem' }}>
            © 2026 MediBook. All rights reserved. Built with ❤️ for better healthcare.
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterLanding;