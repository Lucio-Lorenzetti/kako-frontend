import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/User/Pagos.css";
import Logo from "../../assets/Logo-Color.png";
import CopyRight from "../../components/Home/CopyRight";

const WHATSAPP_PHONE = "5492915024986";

function mapReservaBackend(data) {
  return {
    nombre_jugador: data.nombre_jugador,
    whatsapp: data.whatsapp,
    cantidad_jugadores: data.cantidad_jugadores,
    buscar_pareja: data.buscar_pareja,
    necesita_paleta: data.necesita_paleta,
    dia: new Date(data.turno.fecha).toLocaleDateString("es-AR"),
    hora: data.turno.hora.slice(0, 5),
    cancha: data.turno.cancha,
  };
}

export default function PagoSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [reserva, setReserva] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [wpEnviado, setWpEnviado] = useState(false);

  useEffect(() => {
    // Fuente principal: lo que guardamos en el navegador ANTES de pagar (ver
    // ConfirmarReserva.jsx). No depende de que el webhook de Mercado Pago ya
    // haya confirmado el pago del lado del backend, asi el usuario nunca queda
    // esperando una pantalla que no llega si ese webhook tarda o falla.
    const pendienteRaw = localStorage.getItem("reserva_pendiente");
    if (pendienteRaw) {
      try {
        setReserva(JSON.parse(pendienteRaw));
        setCargando(false);
      } catch {
        console.warn("reserva_pendiente invalida en localStorage");
      }
    }

    // Mejor esfuerzo: si el backend ya tiene la reserva confirmada, preferimos
    // esos datos (mas autoritativos) por encima de lo guardado antes de pagar.
    api
      .get("/mis-reservas/ultima")
      .then((res) => {
        if (res.data && res.data.turno) {
          setReserva(mapReservaBackend(res.data));
        }
      })
      .catch((err) => {
        console.error("No se pudo confirmar la reserva contra el backend:", err);
      })
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <>
        <p>Cargando información de la reserva...</p>
        <CopyRight />
      </>
    );
  }

  const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id");

  const message = reserva
    ? `
Se realizó una nueva reserva...

Jugador: ${reserva.nombre_jugador}
Celular: ${reserva.whatsapp}
Cantidad de jugadores: ${reserva.cantidad_jugadores}
Necesita buscar pareja: ${reserva.buscar_pareja ? "Sí" : "No"}
Necesita que se preste paleta: ${reserva.necesita_paleta ? "Sí" : "No"}

Día: ${reserva.dia}
Hora: ${reserva.hora}
Cancha: ${reserva.cancha}
`
    : `
Hola! Acabo de pagar una reserva pero no me aparecieron los datos en la pantalla de confirmación.${paymentId ? `\nID de pago: ${paymentId}` : ""}
Les mando esto para que confirmen mi turno a mano.
`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

  return (
    <>
    <section className="pagos-section">
      <div className="overlay-pagos">
        <img src={Logo} alt="Logo cancha" className="logo" />

        <h1 className="pagoExitoso">¡Pago exitoso!</h1>

        <h3 className="subtitulo-pago">
          Tu pago fue acreditado correctamente.
          <br />
          {reserva
            ? "Último paso: enviá la reserva por WhatsApp para confirmar el turno."
            : "No pudimos recuperar los datos de tu reserva automáticamente, pero no te preocupes: escribinos por WhatsApp y la confirmamos a mano."}
        </h3>

        <div className="pagos-box">
          {!wpEnviado ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-general btn-wp"
              onClick={() => {
                setWpEnviado(true);
                localStorage.removeItem("reserva_pendiente");
              }}
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
    <CopyRight />
    </>
  );
}
