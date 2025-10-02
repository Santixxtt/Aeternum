import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./assets/css/index.css";
import "./assets/css/dashboard_user.css";
import Home from "./components/index"; 
import Login from "./components/login";
import DashboardUser from "./components/loyout_user/dashboard_user";
import "bootstrap/dist/css/bootstrap.min.css";

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
        <Route path="/" element={<Home isMobile={isMobile} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loyout_user/dashboard_user" element={<DashboardUser />} />
      </Routes>
    </Router>
  );
}

export default App;
