import CambiarPassword from "../../components/Account/CambiarPassword";
import "../../styles/Admin/GlobalsAdmin.css";
import "../../styles/Admin/Perfil.css";

export default function Perfil() {
  return (
    <div className="perfil-container">
      <div className="general-card">
        <h2 className="general-title">Mi Perfil</h2>
        <p className="general-description">Cambiá tu contraseña de acceso.</p>
        <CambiarPassword />
      </div>
    </div>
  );
}
