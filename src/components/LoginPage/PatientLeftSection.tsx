import { Heart } from "lucide-react";
import { useNavigate } from "react-router";

const PatientLeftSection = () => {

  const navigate = useNavigate();
  const heroImage =
    "https://images.unsplash.com/photo-1769698678497-c41f0ab47c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80";
  return (
    <div className="hidden lg:flex lg:w-5/12 relative">
      <img
        src={heroImage}
        alt="Medical"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-cyan-800/80" />
      <div className="relative flex flex-col justify-between p-12 text-white">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Heart size={20} className="text-white" />
          </div>
          <span style={{ fontSize: "1.4rem", fontWeight: 800 }}>
            Norvic Hospital
          </span>
        </div>
        <div>
          <h2
            className="text-white mb-4"
            style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.2 }}
          >
            Secure Access For Patients, Doctors, And Admins
          </h2>
          <p
            className="text-blue-200 mb-8"
            style={{ fontSize: "1rem", lineHeight: 1.7 }}
          >
            Use real account credentials to manage appointments, queue updates,
            prescriptions, and hospital operations from one connected platform.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "3", label: "Doctor Logins" },
              { value: "2", label: "Patient Accounts" },
              { value: "2", label: "Admin Accounts" },
              { value: "Live", label: "Realtime Queue" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <p
                  className="text-white"
                  style={{ fontSize: "1.5rem", fontWeight: 800 }}
                >
                  {s.value}
                </p>
                <p className="text-blue-200" style={{ fontSize: "0.8rem" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-300" style={{ fontSize: "0.8rem" }}>
          Norvic Hospital digital care platform.
        </p>
      </div>
    </div>
  );
};

export default PatientLeftSection;

