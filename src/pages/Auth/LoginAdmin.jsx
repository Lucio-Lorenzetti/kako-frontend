import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Auth/Header";
import GoogleLoginButton from "../../components/Auth/GoogleLoginButton";
import "../../styles/Auth.css";

export default function LoginAdmin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Misma validacion de rol para ambos flujos: solo admin/developer entran,
  // el resto queda con la cuenta creada/vinculada pero sin acceso al panel.
  const validarYEntrar = (token, user) => {
    if (token && (user.role === "admin" || user.role === "developer")) {
      login(token, user);
      localStorage.setItem("userName", user.name);
      navigate("/admin");
    } else {
      setError("No tienes permisos de administrador para acceder aquí.");
    }
  };

  const handleGoogleSuccess = (user, token) => {
    setError(null);
    validarYEntrar(token, user);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Limpiamos errores anteriores

    try {
      const response = await api.post("/login", { email, password });

      const { token, user } = response.data;
      validarYEntrar(token, user);
    } catch (err) {
      console.error(err);
      // Diferenciamos si es un error de datos (401) o de servidor
      if (err.response && err.response.status === 401) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Error en el servidor. Intente más tarde.");
      }
    }
  };

  return (
    <>
      <Header />
      <section className="auth-container">
        <div className="auth-card">
          <h1>Ingreso Administrador</h1>

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
    </>
  );
}
