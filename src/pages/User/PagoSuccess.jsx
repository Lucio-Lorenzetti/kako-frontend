import { useNavigate } from "react-router-dom";
import "../../styles/User/Pagos.css";
import Logo from "../../assets/Logo-Color.png";

export default function PagoSuccess() {
  const navigate = useNavigate();

  return (
    <section className="pagos-section">
      <div className="overlay-pagos">
        <img src={Logo} alt="Logo cancha" className="logo" />
        <h1 className="success">¡Pago exitoso!</h1>
        <p>Tu reserva ha sido confirmada correctamente.</p>
        <button className="btn-home" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    </section>
  );
}
