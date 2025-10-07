import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo-kako-blanco.png";
import "../../styles/AuthHeader.css";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigate = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleRegister = () => {
    navigate("/register"); // 👈 ruta al formulario de registro
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo-container" onClick={() => navigate("/")}>
            <img src={Logo} alt="Logo cancha" className="logo-header" />
        </div>
        <div className="logout-button-container">
          <button className="logout-button" onClick={handleRegister}>
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
