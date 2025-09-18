import { useLocation, useParams } from "react-router-dom";

const ReservarTurno = () => {
  const { id } = useParams();
  const location = useLocation();
  const turno = location.state?.turno; // 👈 ahora extraemos el objeto "turno"

  if (!turno) {
    return <p>No se pudo cargar el turno. Intentá nuevamente.</p>;
  }

  // ✅ Parseamos fecha
  const fechaObj = new Date(turno.fecha);
  const fechaFormateada = fechaObj.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // ✅ Parseamos hora (si viene separada o con segundos)
  let horaFormateada;
  if (turno.hora) {
    // si viene como string "13:00:00"
    horaFormateada = turno.hora.slice(0, 5);
  } else {
    // si viene junto con la fecha tipo "2025-09-18T13:00:00Z"
    horaFormateada = fechaObj.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <section>
      <h1>Confirmar Reserva</h1>
      <p>
        <strong>Cancha:</strong> {turno.cancha}
      </p>
      <p>
        <strong>Fecha:</strong> {fechaFormateada}
      </p>
      <p>
        <strong>Hora:</strong> {horaFormateada}
      </p>
      <p>
        <strong>Precio:</strong> ${turno.precio}
      </p>
      {/* 👇 Acá va tu formulario de confirmación/pago */}
    </section>
  );
};

export default ReservarTurno;
