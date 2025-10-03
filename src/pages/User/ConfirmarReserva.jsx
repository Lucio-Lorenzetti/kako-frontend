import { useLocation, useNavigate } from "react-router-dom"; // <-- Importamos useNavigate
import { useState, useEffect } from "react";
import api from "../../api/api";
import "../../styles/User/ConfirmarReserva.css";

const ConfirmarReserva = () => {
  const location = useLocation();
  const navigate = useNavigate(); // <-- Inicializamos useNavigate
  const turno = location.state?.turno;

  const [user, setUser] = useState(null);
  const [jugadores, setJugadores] = useState("2");
  const [buscoPareja, setBuscoPareja] = useState("false");
  const [prestamoPaletas, setPrestamoPaletas] = useState("false");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Para evitar doble click

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
    if (loading) return; // Evitar múltiples envíos

    if (!telefono) {
      setError("Por favor completá tu número de WhatsApp");
      return;
    }

    setError(null);
    setLoading(true); // Iniciamos la carga

    try {
      const token = localStorage.getItem("token");

      // 1. CREAR RESERVA CON LAS CLAVES CORREGIDAS
      const reservaResponse = await api.post(
        "/reservas",
        {
          turno_id: turno.id,
          cantidad_jugadores: jugadores, // Corregido: antes 'jugadores'
          buscar_pareja: buscoPareja === "true", // Corregido: antes 'busco_pareja'
          whatsapp: telefono, // Corregido: antes 'telefono'
          necesita_paleta: prestamoPaletas === "true", // Corregido: antes 'presta_paletas'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (reservaResponse.status === 201) {
        alert("✅ Reserva confirmada con éxito! Cerrando sesión...");

        // 2. LOGOUT DESPUÉS DE RESERVA EXITOSA
        try {
          // Intentamos llamar al endpoint de logout del backend
          await api.post("/logout", null, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (logoutErr) {
          console.warn("Error en el logout del servidor, continuando con logout local.", logoutErr);
        }

        // 3. ELIMINAR TOKEN Y REDIRIGIR
        localStorage.removeItem("token"); 
        setUser(null); // Limpiar el estado del usuario
        navigate("/"); // Redirigir al home
      } else {
        setError("No se pudo confirmar la reserva. Intentá nuevamente.");
      }
    } catch (err) {
      console.error("Error al confirmar la reserva:", err);
          
      // Manejo de errores detallado
      if (err.response) {
        if (err.response.status === 422 && err.response.data.errors) {
          // Error de validación de Laravel (422)
          const firstError = Object.values(err.response.data.errors)[0][0];
          setError(`Error de validación: ${firstError}`);
        } else if (err.response.data.error) {
          // Errores 400, 403, 404 controlados por el controlador
          setError(err.response.data.error); 
        } else {
          setError(`Error del servidor (${err.response.status}). Intentá nuevamente.`);
        }
      } else {
        setError("Error de conexión. Intentá nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };


  if (!turno) {
    return <p>No se encontró información del turno seleccionado.</p>;
  }

  return (
    <section className="confirmar-container">
      <div className="confirmar-card">
        <h1 className="titulo">Hola {user?.name}, confirmá tu reserva</h1>

        <div className="confirmar-grid">
          {/* Columna izquierda - Formulario */}
          <form className="form-col" onSubmit={handleConfirmar}>
            <label>
            Nº WhatsApp:
            <input
                type="tel"
                placeholder="Ej: 2915551234"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                pattern="^\d{10}$"       // regex que exige exactamente 10 dígitos
                maxLength="10"           // evita que escriba más
                required
                title="Debe contener exactamente 10 dígitos (sin espacios, sin +54, solo el número)"
            />
            </label>

            <label>
              Cantidad de jugadores:
              <select
                value={jugadores}
                onChange={(e) => setJugadores(e.target.value)}
                required
              >
                <option value="2">2</option>
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
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </label>

            <label>
              ¿Buscás Pareja?
              <select
                value={buscoPareja}
                onChange={(e) => setBuscoPareja(e.target.value)}
                required
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </label>

            <div className="boton-container">
              <button type="submit" className="btn-reservar" disabled={loading}>
                {loading ? "Confirmando..." : "Confirmar y Pagar"}
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