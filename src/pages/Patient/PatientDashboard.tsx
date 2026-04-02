import { useAuth } from "@/constants/AuthContext";
import { useNavigate } from "react-router-dom";
import { appointments } from "@/utils/mockData";
import { Calendar, Clock, CheckCircle, XCircle, ChevronRight, Star, Search, CalendarDays, User } from 'lucide-react';
import TopDoctors from "@/components/PatientDashboard/TopDoctors";
import UpcomingDoctors from "@/components/PatientDashboard/UpcomingDoctors";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const patientAppointments = appointments.filter((a) => a.patientId === "p1");
  const upcoming = patientAppointments.filter(
    (a) => a.status === "confirmed" || a.status === "pending",
  );
  const completed = patientAppointments.filter((a) => a.status === "completed");
  const cancelled = patientAppointments.filter((a) => a.status === "cancelled");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-gray-900 mb-1"
            style={{ fontSize: "1.6rem", fontWeight: 800 }}
          >
            Good Morning, {user?.name} 👋
          </h1>
          <p className="text-gray-500" style={{ fontSize: "0.9rem" }}>
            Here's your health overview for today
          </p>
        </div>
        <button
          onClick={() => navigate("/patient/search")}
          className="self-start flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
          style={{ fontWeight: 600 }}
        >
          <Search size={18} /> Book Appointment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Upcoming",
            value: upcoming.length,
            icon: Calendar,
            bg: "bg-blue-50",
            text: "text-blue-600",
            desc: "Scheduled",
          },
          {
            label: "Completed",
            value: completed.length,
            icon: CheckCircle,
            bg: "bg-green-50",
            text: "text-green-600",
            desc: "Visits done",
          },
          {
            label: "Cancelled",
            value: cancelled.length,
            icon: XCircle,
            bg: "bg-red-50",
            text: "text-red-600",
            desc: "This year",
          },
          {
            label: "Doctors Visited",
            value: 3,
            icon: Star,
            bg: "bg-amber-50",
            text: "text-amber-600",
            desc: "Specialists",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div
              className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-3`}
            >
              <s.icon size={22} className={s.text} />
            </div>
            <p
              className="text-gray-900 mb-0.5"
              style={{ fontSize: "1.75rem", fontWeight: 800 }}
            >
              {s.value}
            </p>
            <p
              className="text-gray-800"
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              {s.label}
            </p>
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>


      <div className="grid lg:grid-cols-3 gap-6">
      <UpcomingDoctors />
       <TopDoctors /> 
      </div>
    </div>
  );
};

export default PatientDashboard;
