import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/api";
import "../styles/ConfirmarReserva.css";

const ConfirmarReserva = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const turno = location.state?.turno;

  const [user, setUser] = useState(null);
  const [jugadores, setJugadores] = useState("2");
  const [buscoPareja, setBuscoPareja] = useState("No");
  const [prestamoPaletas, setPrestamoPaletas] = useState("No");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data))
        .catch(() => setError("No se pudo cargar la información del usuario"));
    }
  }, []);

  const handleConfirmar = async (e) => {
    e.preventDefault();
    if (!telefono) {
      setError("Por favor completá tu número de WhatsApp");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/reservas",
        {
          turno_id: turno.id,
          jugadores,
          busco_pareja: buscoPareja,
          telefono,
          presta_paletas: prestamoPaletas,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/"); // Acá después redirigimos a MercadoPago
    } catch {
      setError("Error al confirmar la reserva, intentá nuevamente");
    }
  };

  if (!turno) {
    return <p>No se encontró información del turno seleccionado.</p>;
  }

  return (
    <section className="confirmar-container">
      <div className="confirmar-card">
        <h1 className="titulo">
          Hola {user?.name}, confirmá tu reserva
        </h1>

        <div className="confirmar-grid">
          {/* Columna izquierda - Formulario */}
          <form className="form-col" onSubmit={handleConfirmar}>
            <label>
              Nº WhatsApp:
              <input
                type="tel"
                placeholder="Ej: 291 555 1234"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </label>

            <label>
              Cantidad de jugadores:
              <select
                value={jugadores}
                onChange={(e) => setJugadores(e.target.value)}
                required
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </label>

            <label>
              ¿Necesitás Paleta?
              <select
                value={prestamoPaletas}
                onChange={(e) => setPrestamoPaletas(e.target.value)}
                required
              >
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>
            </label>

            <label>
              ¿Buscás Pareja?
              <select
                value={buscoPareja}
                onChange={(e) => setBuscoPareja(e.target.value)}
                required
              >
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>
            </label>

            <div className="boton-container">
              <button type="submit" className="btn-reservar">
                Confirmar Reserva
              </button>
            </div>
          </form>

          {/* Columna derecha - Info turno */}
          <div className="picker-col">
            <div className="picker-card">
              <h3>Fecha</h3>
              <p>{new Date(turno.fecha).toLocaleDateString("es-AR")}</p>
            </div>
            <div className="picker-card">
              <h3>Hora</h3>
              <p>{turno.hora.slice(0, 5)} hs</p>
            </div>
            <div className="picker-card">
              <h3>Cancha</h3>
              <p>{turno.cancha}</p>
            </div>
          </div>
        </div>

        {error && <p className="error">{error}</p>}
      </div>
    </section>
  );
};

export default ConfirmarReserva;
