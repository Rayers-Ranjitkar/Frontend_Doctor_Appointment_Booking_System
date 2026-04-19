import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import { ROUTES } from "@/constants/routes";
import Login from "@/pages/Login";
import { RedirectIfAuthenticated, RequirePatientAuth } from "@/constants/AuthGate";
import PatientLayout from "@/pages/PatientLayout";
import PatientDashboard from "@/pages/Patient/PatientDashboard";
import SearchDoctors from "@/pages/Patient/SearchDoctors";
<<<<<<< HEAD
import DoctorDashboard from "@/pages/Doctor/DoctorDashboard";
import { Component } from "lucide-react";
import DoctorSchedule from "@/pages/Patient/DoctorSchedule";
=======
>>>>>>> f7f5c39fb100aae6a3f80272382a399799df82cf
const Router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <LandingPage />,
  },
  {
    Component: RedirectIfAuthenticated,
    children: [{ path: ROUTES.LOGIN, Component: Login }],
  },
  {
    path: "/patient",
    Component: RequirePatientAuth,
    children: [
      {
        Component: PatientLayout,
        children: [
          { index: true, Component: PatientDashboard },
          { path: 'search', Component: SearchDoctors },
          
        ],
      },
    ],
  },

  {
    path: '/doctor',
    children: [
    {
      Component: PatientLayout,
      children: [
        {index:true, Component: DoctorSchedule}
      ]
    }
    ]
  }
]);

export default Router;
