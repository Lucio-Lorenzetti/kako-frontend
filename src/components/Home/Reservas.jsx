import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../../api/api";
import "../../styles/User/Reservas.css";

const Reserva = () => {
  const [turnos, setTurnos] = useState([]);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState("interior");
  const navigate = useNavigate();

  const cargarTurnos = () => {
    api.get("/turnos")
      .then((res) => setTurnos(res.data))
      .catch((err) => console.error("Error cargando turnos:", err));
  };

  useEffect(() => {
    cargarTurnos();

    // Calcular milisegundos hasta la medianoche
    const ahora = new Date();
    const proximaMedianoche = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate() + 1, // mañana
      0, 0, 0, 0
    );
    const tiempoHastaMedianoche = proximaMedianoche - ahora;

    // Recargar turnos a la medianoche
    const timeout = setTimeout(() => {
      cargarTurnos();
    }, tiempoHastaMedianoche);

    return () => clearTimeout(timeout);
  }, []);

  const fechaHoy = new Date();

  const hoyUTCString = new Date(
    fechaHoy.getFullYear(),
    fechaHoy.getMonth(),
    fechaHoy.getDate()
  ).toISOString().slice(0, 10);
  // Generamos el límite sumando 6 días a la fecha local.
  const limiteDate = new Date(fechaHoy);
  limiteDate.setDate(fechaHoy.getDate() + 6);
  const limiteUTCString = new Date(
    limiteDate.getFullYear(),
    limiteDate.getMonth(),
    limiteDate.getDate()
  ).toISOString().slice(0, 10);


  const turnosFiltrados = turnos.filter((t) => {
    const fechaTurnoString = t.fecha.split("T")[0]; // Obtiene solo la parte 'AAAA-MM-DD' del turno

    return (
      t.cancha.toLowerCase() === canchaSeleccionada &&
      fechaTurnoString >= hoyUTCString && 
      fechaTurnoString <= limiteUTCString
    );
  });

  const turnosPorDia = turnosFiltrados.reduce((acc, turno) => {
    const fechaKey = turno.fecha.split("T")[0];
    if (!acc[fechaKey]) acc[fechaKey] = [];
    acc[fechaKey].push(turno);
    return acc;
  }, {});

  const handleReserva = (turno) => {
    if (turno.estado === "disponible") {
      navigate("/login", { state: { from: `/reservar/${turno.id}`, turno } });
    }
  };

  return (
    <section id="reserva" className="reservas-section">
      <h1>
        Reservá tu Turno{" "}
        {canchaSeleccionada === "interior" 
          ? "en nuestra Cancha Interior" 
          : "en nuestra Cancha de Blindex"}
      </h1>
      <p>
        Para que la reserva sea confirmada se debe abonar el 50% del valor del turno.<br />
        Si tenés alguna duda, podés comunicarte con nosotros a través de nuestras redes sociales o por WhatsApp.  
      </p>

      <div className="cancha-selector">
        <button
          className={canchaSeleccionada === "interior" ? "activo" : ""}
          onClick={() => setCanchaSeleccionada("interior")}
        >
          Interior
        </button>
        <button
          className={canchaSeleccionada === "exterior" ? "activo" : ""}
          onClick={() => setCanchaSeleccionada("exterior")}
        >
          Exterior
        </button>
      </div>

      <div className="reserva-container">
        {Object.entries(turnosPorDia).map(([fecha, lista]) => (
          <div key={fecha} className="reserva-dia">
            <h3>
              {new Date(`${fecha}T00:00:00`).toLocaleDateString("es-AR", {
                weekday: "long",
                day: "numeric",
              })}
            </h3>

            <div className="turnos-lista">
              {lista.map((t) => (
                <button
                  key={t.id}
                  className={`turno ${t.estado}`}
                  disabled={t.estado !== "disponible"}
                  onClick={() => handleReserva(t)}
                >
                  {t.hora.slice(0, 5)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reserva;