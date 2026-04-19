import Router from "@/routes/Router"
import { RouterProvider } from "react-router-dom"
import { AuthProvider } from "./constants/AuthContext"

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={Router}/>
    </AuthProvider>
  )
}
export default App