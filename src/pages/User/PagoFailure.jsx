import { useNavigate } from "react-router-dom";
import "../../styles/User/Pagos.css";
import Logo from "../../assets/Logo-Color.png";

export default function PagoFailure() {
  const navigate = useNavigate();

  return (
    <section className="pagos-section">
      <div className="overlay-pagos">
        <img src={Logo} alt="Logo cancha" className="logo" />
        <h1 className="error">¡Pago fallido!</h1>
        <p>Tu reserva no pudo ser confirmada. Por favor, intenta nuevamente.</p>
        <button className="btn-home" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    </section>
  );
}
