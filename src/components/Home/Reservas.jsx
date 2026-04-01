import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../../api/api";
import "../../styles/User/Reservas.css";

const Reserva = () => {
  const [turnos, setTurnos] = useState([]);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState("interior");
  
  // Estado para los precios (Iniciamos en null para validar la carga)
  const [precios, setPrecios] = useState(null);

  const [canchasHabilitadas, setCanchasHabilitadas] = useState({
    interior: true,
    exterior: true,
  });
  const navigate = useNavigate();

  // --- MODIFICADO: Ahora carga turnos y precios en una sola petición ---
  const cargarTurnos = () => {
    api.get("/turnos")
      .then((res) => {
        // Asumiendo que el backend ahora devuelve: { turnos: [...], precios: {...} }
        setTurnos(res.data.turnos || []);
        setPrecios(res.data.precios || null);
        console.log("Datos cargados desde el backend:", res.data);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  };

  useEffect(() => {
    cargarTurnos();

    // --- ELIMINADO: Ya no llamamos a /admin/precios por separado ---

    const interiorLS = localStorage.getItem("interiorHabilitada");
    const exteriorLS = localStorage.getItem("exteriorHabilitada");

    setCanchasHabilitadas({
      interior: interiorLS === null ? true : interiorLS === "true",
      exterior: exteriorLS === null ? true : exteriorLS === "true",
    });

    const ahora = new Date();
    const proximaMedianoche = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate() + 1,
      0, 0, 0, 0
    );
    const tiempoHastaMedianoche = proximaMedianoche - ahora;

    const timeout = setTimeout(() => {
      cargarTurnos();
    }, tiempoHastaMedianoche);

    return () => clearTimeout(timeout);
  }, []);

  // Función para obtener la info de la cancha actual sin que rompa si precios es null
  const infoCancha = () => {
    if (!precios) return { precio: "...", sena: "..." };

    if (canchaSeleccionada === "interior") {
      return { 
        precio: precios.interior ?? 0, 
        sena: precios.sena_interior ?? 0 
      };
    } else {
      return { 
        precio: precios.exterior ?? 0, 
        sena: precios.sena_exterior ?? 0 
      };
    }
  };

  const info = infoCancha();

  const fechaHoy = new Date();
  const hoyUTCString = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate()).toISOString().slice(0, 10);
  const limiteDate = new Date(fechaHoy);
  limiteDate.setDate(fechaHoy.getDate() + 6);
  const limiteUTCString = new Date(limiteDate.getFullYear(), limiteDate.getMonth(), limiteDate.getDate()).toISOString().slice(0, 10);

  const turnosFiltrados = turnos.filter((t) => {
    const fechaTurnoString = t.fecha.split("T")[0];
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
        {canchaSeleccionada === "interior" ? "en nuestra Cancha Interior" : "en nuestra Cancha de Blindex"}
      </h1>
      
      <p>
        El valor del turno es de <strong>${info.precio}</strong>.<br />
        Para que la reserva sea confirmada se debe abonar una seña de <strong>${info.sena}</strong>.<br />
        Si tenés alguna duda, podés comunicarte con nosotros a través de nuestras redes sociales o por WhatsApp.
      </p>

      {/*<div className="cancha-selector">
        <button
          className={canchaSeleccionada === "interior" ? "activo" : ""}
          onClick={() => setCanchaSeleccionada("interior")}
          disabled={!canchasHabilitadas.interior}
        >
          Interior
        </button>
        <button
          className={canchaSeleccionada === "exterior" ? "activo" : ""}
          onClick={() => setCanchaSeleccionada("exterior")}
          disabled={!canchasHabilitadas.exterior}
        >
          Exterior
        </button>
      </div>*/}

      <div className="reserva-container">
        {Object.entries(turnosPorDia).map(([fecha, lista]) => (
          <div key={fecha} className="reserva-dia">
            <h3>
              {new Date(`${fecha}T00:00:00`).toLocaleDateString("es-AR", { weekday: "long", day: "numeric" })}
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