import React from "react";
import { Link } from "react-router-dom";

// Agrega las props isDashboard y onLogout
const BottomNav = ({ isDashboard, onLogout }) => { 
    
    // Versión para usuarios AUTENTICADOS (Dashboard)
    if (isDashboard) {
        return (
            <nav className="bottom-nav dashboard-nav">
                <Link to="/dashboard" className="nav-item active">
                    <i className="bx bx-home"></i>
                    <span>Inicio</span>
                </Link>
                <Link to="/catalogo" className="nav-item">
                    <i className="bx bx-book"></i>
                    <span>Catálogo</span>
                </Link>
                <Link to="/catalogo" className="nav-item"> 
                    <i className="bx bx-search"></i>
                    <span>Buscar</span>
                </Link>
                <Link to="/listadeseos" className="nav-item"> 
                    <i className="bx bxs-heart"></i>
                    <span>Deseos</span>
                </Link>
                <Link to="/" onClick={onLogout} className="nav-item"> 
                    <i className="bx bx-log-out"></i>
                    <span>Salir</span>
                </Link>
            </nav>
        );
    }
    
    // Versión para usuarios NO autenticados (Home público)
    return (
        <nav className="bottom-nav">
            <Link to="/" className="nav-item active">
                <i className="bx bx-home"></i>
                <span>Inicio</span>
            </Link>
            <Link to="/catalogo" className="nav-item">
                <i className="bx bx-book"></i>
                <span>Catálogo</span>
            </Link>
            {/* Estos enlaces deberían ser ajustados a tus rutas públicas */}
            <a href="#" className="nav-item">
                <i className="bx bx-phone"></i>
                <span>Contacto</span>
            </a>
            <Link to="/login" className="nav-item">
                <i className="bx bx-user"></i>
                <span>Ingreso</span>
            </Link>
        </nav>
    );
};

export default BottomNav;