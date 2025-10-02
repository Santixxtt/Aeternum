import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/aeternum_logo.png";
import "../../assets/css/dashboard_user.css";

const Header = ({ onSearch, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add("sticky");
      } else {
        navbar.classList.remove("sticky");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <header className="header" id="navbar">
      <div className="header-content">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>

        <nav className="nav">
          <ul>
            <li><a href="#"><i className="bx bx-home"></i> Inicio</a></li>
            <li><a href="#"><i className="bx bx-book"></i> Catálogo</a></li>
            <li><a href="#"><i className="bx bx-star"></i> Lista de Deseos</a></li>
          </ul>
        </nav>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar libros..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">
            <i className="bx bx-search"></i>
          </button>
        </form>

        <div className="user-menu">
          <i
            className="bx bx-user-circle user-icon"
            onClick={() => setShowMenu(!showMenu)}
          ></i>

          {showMenu && (
            <ul className="dropdown">
              <li><a href="#"><i className="bx bx-user"></i> Perfil</a></li>
              <li onClick={handleLogout}>
                <i className="bx bx-log-out"></i> Cerrar sesión
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
