import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./assets/css/dashboard_user.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Importación de componentes
import Home from "./components/home"; 
import Login from "./components/login";
import Register from "./components/register";
import ResetPassword from "./components/ResetPassword";
import DashboardUser from "./components/loyout_user/dashboard_user";
import Catalogo from "./components/loyout_user/catalogo";
import Listadeseos from "./components/loyout_user/listadeseos";
import Perfil from "./components/loyout_user/perfil";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    AOS.init({ duration: 800 });

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home isMobile={isMobile} />} />

        {/* Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Recuperación de contraseña */}
        <Route path="/restablecer-contrasena" element={<ResetPassword />} />

        {/* Dashboard de usuario */}
        <Route path="/loyout_user/dashboard_user" element={<DashboardUser />} />
        <Route path="/loyout_user/catalogo" element={<Catalogo />} />
        <Route path="/loyout_user/lista_deseos" element={<Listadeseos />} />
        <Route path="/loyout_user/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;
