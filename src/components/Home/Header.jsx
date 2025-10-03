import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <- import
import Logo from "../../assets/logo-kako-blanco.png";
import "../../styles/User/Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // <- hook

  return (
    <header className="header-container">
      <div className="header-logo-container">
        <img src={Logo} alt="Logo cancha" className="logo-header" />
      </div>

      {/* Menú de hamburguesa para móvil */}
      <div
        className="hamburger-menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Navegación principal */}
      <div className="header-nav-container">
        <nav className={`header-nav ${isMenuOpen ? "open" : ""}`}>
          <a href="#index">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#reservas">Reservas</a>
          <a href="#contacto">Contacto</a>

          {/* Botón de Administrador dentro del menú para móvil */}
          <div className="header-admin-container mobile">
            <button
              className="admin-button"
              onClick={() => navigate("/admin/login")} // <- usar navigate
            >
              Administrador
            </button>
          </div>
        </nav>
      </div>

      {/* Botón de Administrador para escritorio */}
      <div className="header-admin-container desktop">
        <button
          className="admin-button"
          onClick={() => navigate("/admin/login")} // <- usar navigate
        >
          Administrador
        </button>
      </div>
    </header>
  );
};

export default Header;
