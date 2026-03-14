import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo-kako-blanco.png";
import "../../styles/User/Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (id) => {
    setIsMenuOpen(false); // Cierra el menú al clickear
    if (id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="header-container">
      <div className="header-logo-container" onClick={() => navigate("/")}>
        <img src={Logo} alt="Logo" className="logo-header" />
      </div>

      <div className={`hamburger-menu ${isMenuOpen ? "active" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <nav className={`header-nav ${isMenuOpen ? "open" : ""}`}>
        <a href="#index" onClick={() => handleNavClick("index")}>Inicio</a>
        <a href="#servicios" onClick={() => handleNavClick("servicios")}>Servicios</a>
        <a href="#reservas" onClick={() => handleNavClick("reservas")}>Turnos</a>
        <a href="#contacto" onClick={() => handleNavClick("contacto")}>Contacto</a>
        
        <div className="header-admin-container mobile">
          <button className="admin-button" onClick={() => navigate("/admin/login")}>
            Administrador
          </button>
        </div>
      </nav>

      <div className="header-admin-container desktop">
        <button className="admin-button" onClick={() => navigate("/admin/login")}>
          Administrador
        </button>
      </div>
    </header>
  );
};

export default Header;