import React, { useState } from "react";
import "../../styles/Globals.css";
import Logo from "../../assets/logo-kako-blanco.png"; // Asegúrate de tener un logo en esta ruta

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "4%",
        backgroundColor: "rgba(122, 166, 199, 0.75)",
        color: "#fff",
        display: "flex",
        justifyContent: "center", // nav centrado
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div style={{ height: "100%", position: "absolute", left: "2%" }}>
        <img src={Logo} alt="Logo cancha" className="logo-header" />
      </div>
      {/* NAV - centrado */}
      <nav style={{ display: "flex", gap: "30px" }}>
        <a href="#index" style={{ color: "#fff", textDecoration: "none" }}>
          Inicio
        </a>
        <a href="#servicios" style={{ color: "#fff", textDecoration: "none" }}>
          Servicios
        </a>
        <a href="#reservas" style={{ color: "#fff", textDecoration: "none" }}>
          Reservas
        </a>
        <a href="#contacto" style={{ color: "#fff", textDecoration: "none" }}>
          Contacto
        </a>
      </nav>

      {/* BOTÓN DE LOGIN - absoluto a la derecha */}
      <div style={{ position: "absolute", right: "7%" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "transparent",
            color: "#fff",
            padding: "2px 2px",
            cursor: "pointer",
          }}
        >
          Administrador
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "120%",
              right: 0,
              backgroundColor: "#fff",
              color: "#333",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <a
              href="#login"
              style={{
                display: "block",
                padding: "10px 20px",
                textDecoration: "none",
                color: "#333",
              }}
            >
              Ingresar
            </a>
            <a
              href="#register"
              style={{
                display: "block",
                padding: "10px 20px",
                textDecoration: "none",
                color: "#333",
              }}
            >
              Registrarse
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
