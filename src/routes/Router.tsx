import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import { RedirectIfAuthenticated, RequireAdminAuth, RequireDoctorAuth, RequirePatientAuth } from "@/constants/AuthGate";
import PatientLayout from "@/pages/Patient/PatientLayout";
import PatientDashboard from "@/pages/Patient/PatientDashboard";
import SearchDoctors from "@/pages/Patient/SearchDoctors";
import BookAppointment from "@/pages/Patient/BookAppointment";
import MyAppointments from "@/pages/Patient/MyAppointments";
import PatientAssistant from "@/pages/Patient/PatientAssistant";
import PatientProfile from "@/pages/Patient/PatientProfile";
import PatientPrescriptions from "@/pages/Patient/PatientPrescriptions";
import DoctorLayout from "@/pages/Doctor/DoctorLayout";
import DoctorDashboard from "@/pages/Doctor/DoctorDashboard";
import DoctorAppointments from "@/pages/Doctor/DoctorAppointments";
import DoctorPrescriptions from "@/pages/Doctor/DoctorPrescriptions";
import DoctorSchedule from "@/pages/Doctor/DoctorSchedule";
import DoctorProfile from "@/pages/Doctor/DoctorProfile";
import AdminLayout from "@/pages/Admin/AdminLayout";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminAppointments from "@/pages/Admin/AdminAppointments";
import DoctorVerification from "@/pages/Admin/DoctorVerification";
import ManageDoctors from "@/pages/Admin/ManageDoctors";
import ManagePatients from "@/pages/Admin/ManagePatients";
import ManageSpecialties from "@/pages/Admin/ManageSpecialties";

const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  {
    Component: RedirectIfAuthenticated,
    children: [
      { path: "/login", Component: Login },
    ],
  },
  {
    path: "/patient",
    Component: RequirePatientAuth,
    children: [
      {
        Component: PatientLayout,
        children: [
          { index: true, Component: PatientDashboard },
          { path: "search", Component: SearchDoctors },
          { path: "book/:doctorId", Component: BookAppointment },
          { path: "appointments", Component: MyAppointments },
          { path: "prescriptions", Component: PatientPrescriptions },
          { path: "assistant", Component: PatientAssistant },
          { path: "profile", Component: PatientProfile },
        ],
      },
    ],
  },
  {
    path: "/doctor",
    Component: RequireDoctorAuth,
    children: [
      {
        Component: DoctorLayout,
        children: [
          { index: true, Component: DoctorDashboard },
          { path: "appointments", Component: DoctorAppointments },
          { path: "prescriptions", Component: DoctorPrescriptions },
          { path: "schedule", Component: DoctorSchedule },
          { path: "profile", Component: DoctorProfile },
        ],
      },
    ],
  },
  {
    path: "/admin",
    Component: RequireAdminAuth,
    children: [
      {
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: "appointments", Component: AdminAppointments },
          { path: "doctors", Component: ManageDoctors },
          { path: "patients", Component: ManagePatients },
          { path: "specialties", Component: ManageSpecialties },
          { path: "verification", Component: DoctorVerification },
        ],
      },
    ],
  },
]);

export default router;