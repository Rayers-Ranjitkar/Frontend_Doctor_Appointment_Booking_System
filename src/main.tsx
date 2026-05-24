
  import { createRoot } from "react-dom/client";
  import App from "@/App.tsx";
  import { AuthProvider } from "@/constants/AuthContext.tsx";
  import { ClinicProvider } from "@/context/ClinicContext";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <ClinicProvider>
        <App />
      </ClinicProvider>
    </AuthProvider>,
  );
  
