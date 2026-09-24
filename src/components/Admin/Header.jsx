// src/components/Admin/Header.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 importar navigate
import Logo from "../../assets/logo-kako-blanco.png";
import "../../styles/Admin/AdminHeader.css";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isDeveloper = user?.role === "developer";

  // 🔹 Función para cerrar sesión
  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  // 🔹 Función para ir al Home (logo)
  const goHome = async () => {
    await logout(); // <- opcional: también cerrar sesión
    navigate("/"); // <- home público
  };

  return (
    <header className="header-container">
      {/* Logo o título */}
      <div className="header-logo-container" onClick={goHome}>
        <img src={Logo} alt="Logo cancha" className="logo-header" />
        {isDeveloper && <span className="role-badge">Developer</span>}
      </div>

      {/* Menú hamburguesa (móvil) */}
      <div
        className="hamburger-menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Navegación principal */}
      <nav className={`header-nav ${isMenuOpen ? "open" : ""}`}>
        <a href="/admin/dashboard">Inicio</a>
        <a href="/admin/reservas">Reservas</a>
        <a href="/admin/usuarios">Usuarios</a>
        <a href="/admin/turnos">Turnos</a>
        <a href="/admin/ayuda">Ayuda</a>

        {/* Admin en menú móvil */}
        <div className="header-admin-container mobile">
          <button
            className="admin-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Opciones
          </button>
          {isDropdownOpen && (
            <div className="admin-dropdown">
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </nav>

      {/* Admin en escritorio */}
      <div className="header-admin-container desktop">
        <button className="admin-button" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </header>
  );
}
