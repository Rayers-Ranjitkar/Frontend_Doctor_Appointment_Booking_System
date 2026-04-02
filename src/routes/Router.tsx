import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import { ROUTES } from "@/constants/routes";
import Login from "@/pages/Login";
import { RedirectIfAuthenticated, RequirePatientAuth } from "@/constants/AuthGate";

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
  },
]);

export default Router;
