import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Header from "../../components/Auth/Header";
import "../../styles/Auth.css";

export default function LoginAdmin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Limpiamos errores anteriores

    try {
      const response = await api.post("/login", { email, password });

      const { token, user } = response.data;

      // VALIDACIÓN: Verificamos que el rol sea exactamente 'admin'
      if (token && user.role === "admin") {
        localStorage.setItem("token", token);
        // Opcional: guardar nombre para mostrarlo en el dashboard
        localStorage.setItem("userName", user.name); 
        
        navigate("/admin");
      } else {
        // Si el usuario existe pero es un cliente común ('user')
        setError("No tienes permisos de administrador para acceder aquí.");
      }

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
