import { createBrowserRouter } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import {ROUTES} from "@/constants/routes"

const Router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        element: <LandingPage />
    }    
])

export default Router