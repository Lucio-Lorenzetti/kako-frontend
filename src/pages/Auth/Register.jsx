import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Header from "../../components/Auth/Header";
import "../../styles/Auth.css";

const Register = () => {
  const navigate = useNavigate();

  // Inputs separados para nombre y apellido
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Concatenar nombre y apellido en el atributo 'name'
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      const response = await api.post("/register", {
        name: fullName,
        email,
        password,
        password_confirmation: passwordConfirm, // Laravel espera esto
      });

      console.log("Registro exitoso:", response.data);

      // Redirigir al login después del registro
      navigate("/login");
    } catch (err) {
      console.error("Error en registro:", err.response?.data || err.message);

      // Manejo más completo de errores de validación
      const errors = err.response?.data?.errors || {};
      setError(
        errors.name?.[0] ||
        errors.email?.[0] ||
        errors.password?.[0] ||
        "Error al registrar usuario. Verifica los datos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Header /> { Header con botón “Registrarse” */}
      <section className="auth-container">
        <div className="auth-card">
          <h1>Registrarse</h1>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
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
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </section>
    </>
  );
};

export default Register;
