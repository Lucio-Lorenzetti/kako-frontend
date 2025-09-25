// src/pages/Admin/LoginAdmin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "../../styles/Auth.css";

export default function LoginAdmin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin"); // redirige al panel
      }
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o error en el servidor");
    }
  };

  return (
    <section className="auth-container">
      <div className="auth-card">
        <h1>Ingreso Administrador</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </section>
  );
}
