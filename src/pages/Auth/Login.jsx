import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import Header from "../../components/Auth/Header";
import "../../styles/Auth.css";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      const destino = location.state?.from || "/";
      const turno = location.state?.turno || null;

      if (turno) {
        navigate(`/reservar/${turno.id}`, { state: { turno } });
      } else {
        navigate(destino);
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Credenciales inválidas o error en el servidor");
    }
  };

  return (
    <>
      <Header />
      <section className="auth-container">
        <div className="auth-card">
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
    </>
  );
};

export default Login;
