import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/User/Pagos.css";
import Logo from "../../assets/Logo-Color.png";

export default function PagoSuccess() {
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [wpEnviado, setWpEnviado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    api.get("/mis-reservas/ultima", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setReserva(res.data);
    })
    .catch(err => {
      console.error("Error cargando reserva:", err);
    });
  }, []);

  if (!reserva) {
    return <p>Cargando información de la reserva...</p>;
  }

  const phone = "5492914973266";

  const message = `
Se realizó una nueva reserva...

Jugador: ${reserva.nombre_jugador}
Celular: ${reserva.whatsapp}
Cantidad de jugadores: ${reserva.cantidad_jugadores}
Necesita buscar pareja: ${reserva.buscar_pareja ? "Sí" : "No"}
Necesita que se preste paleta: ${reserva.necesita_paleta ? "Sí" : "No"}

Día: ${new Date(reserva.turno.fecha).toLocaleDateString("es-AR")}
Hora: ${reserva.turno.hora.slice(0, 5)}
Cancha: ${reserva.turno.cancha}
`;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <section className="pagos-section">
      <div className="overlay-pagos">
        <img src={Logo} alt="Logo cancha" className="logo" />

        <h1 className="pagoExitoso">¡Pago exitoso!</h1>

        <h3 className="subtitulo-pago">
          Tu pago fue acreditado correctamente.
          <br />
          Último paso: enviá la reserva por WhatsApp para confirmar el turno.
        </h3>

        <div className="pagos-box">
          {!wpEnviado ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-general btn-wp"
              onClick={() => setWpEnviado(true)}
            >
              Enviar reserva por WhatsApp
            </a>
          ) : (
            <button
              className="btn-general btn-volver"
              onClick={() => navigate("/")}
            >
              Volver al inicio
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
