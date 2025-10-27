import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importamos useLocation
import logo from "../../assets/img/aeternum_logo.png";
import "../../assets/css/dashboard_user.css";

const Header = ({ onSearch, onLogout, usuario }) => {
    // ELIMINADO: const [usuario, setUsuario] = useState({...});
    // Ahora 'usuario' viene de las props.
    
    const location = useLocation(); // Hook para obtener la ruta actual
    const [showMenu, setShowMenu] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    // Función para verificar si la ruta actual coincide con la ruta del enlace
    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        // En un componente autónomo, el manejo del scroll debe ocurrir en el elemento principal
        // ya que no hay un archivo CSS global. Usaremos un selector simple para simular 'navbar'.
        const navbar = document.querySelector(".header"); 
        
        const handleScroll = () => {
            if (navbar) {
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

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(query);
    };

    const handleQueryChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (newQuery.length === 0 && onSearch) {
            onSearch(newQuery);
        }
    };
    
    const handleLogout = () => {
        if (onLogout) onLogout();
        navigate("/");
    };

    const handleNavigate = (path) => {
        navigate(path);
        setShowMenu(false);
    };



    return (
        <header className="header" id="navbar">
            <div className="header-content">
                <div
                    className="logo"
                    onClick={() => handleNavigate("/loyout_user/dashboard_user")}
                    style={{ cursor: "pointer" }}
                >
                    <img src={logo} alt="logo" />
                </div>

                <nav className="nav">
                    <ul>
                        <li 
                            onClick={() => handleNavigate("/loyout_user/dashboard_user")}
                            // APLICACIÓN DE CLASE ACTIVA
                            className={isActive("/loyout_user/dashboard_user") ? 'active' : ''}
                        >
                            <i className="bx bx-home"></i> Inicio
                        </li>
                        <li 
                            onClick={() => handleNavigate("/loyout_user/catalogo")}
                            // APLICACIÓN DE CLASE ACTIVA
                            className={isActive("/loyout_user/catalogo") ? 'active' : ''}
                        >
                            <i className="bx bx-book"></i> Catálogo
                        </li>
                        <li 
                            onClick={() => handleNavigate("/loyout_user/lista_deseos")}
                            // APLICACIÓN DE CLASE ACTIVA
                            className={isActive("/loyout_user/lista_deseos") ? 'active' : ''}
                        >
                            <i className="bx bx-star"></i> Lista de Deseos
                        </li>
                    </ul>
                </nav>

                {/* Barra de búsqueda */}
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Buscar libros..."
                        value={query}
                        onChange={handleQueryChange}
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
                            {usuario ? (
                                    <li>
                                        <i className='bx bx-user'></i> {usuario.nombre} {usuario.apellido}
                                    </li>
                                ) : (
                                    <li>Cargando Usuario...</li>
                                )}
                            <li onClick={() => handleNavigate("/loyout_user/perfil")}>
                                <i className='bxr bx-face'></i> Perfil
                            </li>
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