import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Auth/Header";
import CopyRight from "../../components/Home/CopyRight";
import GoogleLoginButton from "../../components/Auth/GoogleLoginButton";
import "../../styles/Auth.css";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Comun para el login tradicional y el de Google: adonde ir despues de loguearse
  const irADestino = () => {
    const destino = location.state?.from || "/";
    const turno = location.state?.turno || null;

    if (turno) {
      navigate(`/reservar/${turno.id}`, { state: { turno } });
    } else {
      navigate(destino);
    }
  };

  const handleGoogleSuccess = (user, token) => {
    login(token, user);
    irADestino();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { email, password });

      if (response.data.token) {
        login(response.data.token, response.data.user);
      }

      irADestino();
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

          <div className="google-login-container">
            <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={setError} />
          </div>

          <div className="auth-divider">o con tu email</div>

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
      <CopyRight />
    </>
  );
};

export default Login;
