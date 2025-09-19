import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../../api/api";
import "../../styles/Reservas.css";

const Reserva = () => {
  const [turnos, setTurnos] = useState([]);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState("interior");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/turnos")
      .then((res) => setTurnos(res.data))
      .catch((err) => console.error("Error cargando turnos:", err));
  }, []);

  const turnosFiltrados = turnos.filter(
    (t) => t.cancha.toLowerCase() === canchaSeleccionada
  );

  const turnosPorDia = turnosFiltrados.reduce((acc, turno) => {
    const fechaKey = turno.fecha.split("T")[0];
    if (!acc[fechaKey]) acc[fechaKey] = [];
    acc[fechaKey].push(turno);
    return acc;
  }, {});

  const handleReserva = (turno) => {
    if (turno.estado === "disponible") {
      // Lo mandamos al login y pasamos el turno como "state"
      navigate("/login", { state: { from: `/reservar/${turno.id}`, turno } });
    }
  };

  return (
    <section id="reserva" className="reservas-section">
      <h1>
        Reservá tu Turno
        {" "}
        {canchaSeleccionada === "interior" ? "en nuestra Cancha Interior" : "en nuestra Cancha de Blindex"}
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
