import { useEffect } from "react";
import logo from "../../assets/img/aeternum_logo.png";
import { Link } from "react-router-dom";

const Header = () => {
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

  return (
    <header className="header" id="navbar">
      <div className="header-content">
        <div className="logo">
             <img src={logo} alt="logo" />
           </div>
        <nav className="nav">
          <ul>
            <li><a href="#"><i className="bx bx-home"></i> Inicio</a></li>
            <li><a href="#"><i className="bx bx-book"></i> Catalogo</a></li>
            <li><a href="#"><i className="bx bx-phone"></i> Contacto</a></li>
            <li>
              <Link to="/login" className="login-button">
                <i className="bx bx-user-circle"></i> Inicio de sesión
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;