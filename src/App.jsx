import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./assets/css/index.css";

import Header from "./components/loyout_major/header";
import Hero from "./components/loyout_major/hero";
import Features from "./components/loyout_major/features";
import BookCount from "./components/loyout_major/BookCount";
import Footer from "./components/loyout_reusable/footer";
import ConsentModal from "./components/loyout_major/ConsentModal";
import Bottomnav from "./components/loyout_major/Bottomnav";
import Login from "./components/login"; // 👈 tu login

function Home({ isMobile }) {
  return (
    <>
      {isMobile ? <Bottomnav /> : <Header />}
      <Hero />
      <Features />
      <BookCount />
      <Footer />
      <ConsentModal />
    </>
  );
}

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
        {/* Ruta principal */}
        <Route path="/" element={<Home isMobile={isMobile} />} />

        {/* Ruta de login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
