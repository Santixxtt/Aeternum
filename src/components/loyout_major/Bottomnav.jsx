import React from "react";
import { Link } from "react-router-dom";

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <a href="#" className="nav-item active">
        <i className="bx bx-home"></i>
        <span>Inicio</span>
      </a>
      <a href="#" className="nav-item">
        <i className="bx bx-book"></i>
        <span>Catalogo</span>
      </a>
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
