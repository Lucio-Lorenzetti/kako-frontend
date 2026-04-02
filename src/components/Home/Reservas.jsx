import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../../api/api";
import "../../styles/User/Reservas.css";

const Reserva = () => {
  const [turnos, setTurnos] = useState([]);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState("interior");
  const [precios, setPrecios] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cargarDatos = () => {
    setLoading(true);
    api.get("/turnos")
      .then((res) => {
        // Manejamos si el backend devuelve {turnos:[], precios:{}} o solo el array
        const dataTurnos = res.data.turnos || (Array.isArray(res.data) ? res.data : []);
        const dataPrecios = res.data.precios || null;
        
        setTurnos(dataTurnos);
        if (dataPrecios) setPrecios(dataPrecios);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando datos:", err);
        setLoading(false);
      });

    // Petición de respaldo para precios si el endpoint /turnos no los trae
    api.get("/precios-publicos")
      .then((res) => setPrecios(res.data))
      .catch((err) => console.error("Error precios:", err));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Lógica de Precios Segura
  const info = precios ? {
    precio: canchaSeleccionada === "interior" ? (precios.interior ?? 0) : (precios.exterior ?? 0),
    sena: canchaSeleccionada === "interior" ? (precios.sena_interior ?? 0) : (precios.sena_exterior ?? 0)
  } : { precio: "...", sena: "..." };

  // Lógica de Fechas (Formato YYYY-MM-DD)
  const ahora = new Date();
  const hoyStr = ahora.toISOString().slice(0, 10);
  
  const limiteDate = new Date();
  limiteDate.setDate(ahora.getDate() + 6); // Ver 7 días a futuro
  const limiteStr = limiteDate.toISOString().slice(0, 10);

  // Filtro de Turnos
  const turnosFiltrados = turnos.filter((t) => {
    if (!t.fecha || !t.cancha) return false;
    const fechaT = t.fecha.split("T")[0];
    const canchaT = t.cancha.toLowerCase();
    const buscada = canchaSeleccionada.toLowerCase();

    return canchaT === buscada && fechaT >= hoyStr && fechaT <= limiteStr;
  });

  // Agrupar por día
  const turnosPorDia = turnosFiltrados.reduce((acc, t) => {
    const key = t.fecha.split("T")[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  return (
    <section id="reserva" className="reservas-section">
      <h1>Reservá tu Turno en nuestra Cancha {canchaSeleccionada === "interior" ? "Interior" : "de Blindex"}</h1>
      
      <div className="precios-info">
        <p>
          El valor del turno es de <strong>${info.precio}</strong>.<br />
          La reserva se cofnirma abonando una seña de <strong>${info.sena}</strong>.<br />
          Si tenés alguna duda, podés comunicarte con nosotros por WhatsApp.
        </p>
      </div>

      {loading ? <p>Cargando turnos...</p> : (
        <div className="reserva-container">
          {Object.keys(turnosPorDia).length > 0 ? (
            Object.entries(turnosPorDia).map(([fecha, lista]) => (
              <div key={fecha} className="reserva-dia">
                <h3>{new Date(`${fecha}T00:00:00`).toLocaleDateString("es-AR", { weekday: "long", day: "numeric" })}</h3>
                <div className="turnos-lista">
                  {lista.sort((a,b) => a.hora.localeCompare(b.hora)).map((t) => (
                    <button 
                      key={t.id} 
                      className={`turno ${t.estado}`}
                      disabled={t.estado !== "disponible"}
                      onClick={() => navigate("/login", { state: { from: `/reservar/${t.id}`, turno: t } })}
                    >
                      {t.hora.slice(0, 5)}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : <p>No hay turnos disponibles para esta cancha en los próximos días.</p>}
        </div>
      )}
    </section>
  );
};

export default Reserva;