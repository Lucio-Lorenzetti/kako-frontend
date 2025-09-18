import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = () => {
    // acá validás credenciales del usuario

    // si el login es exitoso:
    const destino = location.state?.from || "/";
    const turno = location.state?.turno || null;

    navigate(destino, { state: { turno } });
  };

  return (
    <section>
      <h1>Login</h1>
      <button onClick={handleLogin}>Ingresar</button>
    </section>
  );
};

export default Login;
