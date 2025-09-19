import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api"; // fijate que la ruta sea esta

import "../styles/Login.css"; // archivo CSS que te paso abajo

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      console.log("Respuesta login:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      const destino = location.state?.from || "/";
      const turno = location.state?.turno || null;

      navigate(destino, { state: { turno } });
    } catch (err) {
      console.error("Error en login:", err);
      setError("Credenciales inválidas o error en el servidor");
    }
  };

  return (
    <section className="login-container">
      <div className="login-card">
        <h1>Iniciar Sesión</h1>
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
};

export default Login;
