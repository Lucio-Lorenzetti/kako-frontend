import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/api";
import "../styles/ConfirmarReserva.css";

const ConfirmarReserva = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const turno = location.state?.turno;

  const [user, setUser] = useState(null);
  const [jugadores, setJugadores] = useState("");
  const [buscoPareja, setBuscoPareja] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("Error obteniendo usuario:", err);
          setError("No se pudo cargar la información del usuario");
        });
    }
  }, []);

  const handleConfirmar = async (e) => {
    e.preventDefault();
    if (!jugadores || !telefono) {
      setError("Por favor completa todos los campos obligatorios");
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
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/"); // después lo podemos mandar a una página de éxito
    } catch (err) {
      console.error("Error confirmando reserva:", err);
      setError("Error al confirmar la reserva, intentá nuevamente");
    }
  };

  if (!turno) {
    return <p>No se encontró información del turno seleccionado.</p>;
  }

  return (
    <section className="confirmar-container">
      <div className="confirmar-card">
        <h1>Confirmar Reserva</h1>

        <div className="turno-info">
          <p><strong>Día:</strong> {new Date(turno.fecha).toLocaleDateString("es-AR")}</p>
          <p><strong>Hora:</strong> {turno.hora.slice(0, 5)} hs</p>
          <p><strong>Cancha:</strong> {turno.cancha}</p>
          {user && <p><strong>Nombre:</strong> {user.name}</p>}
        </div>

        <form onSubmit={handleConfirmar}>
          <label>
            Cantidad de jugadores:
            <input
              type="number"
              min="1"
              max="4"
              value={jugadores}
              onChange={(e) => setJugadores(e.target.value)}
              required
            />
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={buscoPareja}
              onChange={(e) => setBuscoPareja(e.target.checked)}
            />
            Quiero que me busquen pareja
          </label>

          <label>
            Número de teléfono:
            <input
              type="tel"
              placeholder="Ej: 291 555 1234"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </label>

          <button type="submit">Confirmar Reserva</button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </section>
  );
};

export default ConfirmarReserva;
