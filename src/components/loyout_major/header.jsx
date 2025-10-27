import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/img/aeternum_logo.png";

const Header = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const navbar = document.getElementById("navbar");

    const handleScroll = () => {
      if (window.innerWidth > 768) {
        if (window.scrollY > 50) {
          navbar.classList.add("sticky");
        } else {
          navbar.classList.remove("sticky");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función para navegar entre rutas
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <header className="header" id="navbar">
      <div className="header-content">
        {/* LOGO */}
        <div className="logo" onClick={() => handleNavigate("/")}>
          <img src={logo} alt="Logo Aeternum" />
        </div>

        {/* NAVEGACIÓN */}
        <nav className="nav">
          <ul>
            <li onClick={() => handleNavigate("/")}>
              <i className="bx bx-home"></i> Inicio
            </li>
            <li onClick={() => handleNavigate("")}>
              <i className="bx bx-book"></i> Catálogo
            </li>
            <li onClick={() => handleNavigate("")}>
              <i className="bx bx-phone"></i> Contacto
            </li>
            <li>
              <Link to="/login" className="login-button">
                <i className="bx bx-user-circle"></i> Iniciar sesión
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
