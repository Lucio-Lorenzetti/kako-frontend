import { useNavigate } from "react-router-dom";
import Header from "../../components/Home/Header";
import CopyRight from "../../components/Home/CopyRight";
import CambiarPassword from "../../components/Account/CambiarPassword";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Auth.css";

export default function Perfil() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <Header />
      <section className="auth-container">
        <div className="auth-card">
          <h1>Mi Cuenta</h1>
          <CambiarPassword />
          <button type="button" className="perfil-logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </section>
      <CopyRight />
    </>
  );
}
