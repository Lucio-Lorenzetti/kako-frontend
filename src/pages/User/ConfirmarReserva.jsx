import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import MercadoPagoButton from "../../components/Home/MercadoPagoButton";
import api from "../../api/api";
import Header from "../../components/Auth/Header";
import "../../styles/User/ConfirmarReserva.css";

const ConfirmarReserva = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [turno, setTurno] = useState(location.state?.turno || null);
  const [user, setUser] = useState(null);
  const [jugadores, setJugadores] = useState("2");
  const [buscoPareja, setBuscoPareja] = useState("false");
  const [prestamoPaletas, setPrestamoPaletas] = useState("false");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar información del usuario logueado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          console.log("Usuario cargado:", res.data); // 👈 Verás esto en la consola del navegador
          setUser(res.data);
        })
        .catch(() => setError("No se pudo cargar la información del usuario"));
    }
  }, []);

  // 🔹 Prellenar el número de teléfono si el usuario lo tiene guardado
  useEffect(() => {
    if (user?.whatsapp && /^\d{10}$/.test(user.whatsapp)) {
      setTelefono(user.whatsapp);
    }
  }, [user]);

  // 🔹 Cargar datos del turno si no vinieron por props
  useEffect(() => {
    if (!turno && id) {
      setLoading(true);
      api
        .get(`/turnos/${id}`)
        .then((res) => setTurno(res.data))
        .catch((err) => {
          console.error("Error cargando turno:", err);
          setError("No se pudo cargar el turno seleccionado.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, turno]);

  const isFormValid = () => {
    if (!turno || !turno.id || turno.precio * Number(jugadores) <= 0) {
      return false;
    }

    // Solo validamos que el número tenga 10 dígitos
    if (!telefono || telefono.length !== 10) {
      return false;
    }

    return true;
  };

  const handleConfirmar = (e) => {
    e.preventDefault();
  };

  if (loading) return <p>Cargando turno...</p>;

  if (!turno) {
    return <p>No se encontró información del turno seleccionado.</p>;
  }

  return (
  <>
    <Header />
    <section className="confirmar-container">
      <div className="confirmar-card">
        {/* 👇 render condicional para mostrar correctamente el nombre */}
        {user ? (
          <h1 className="titulo">
            Hola {user.name}, confirmá tu reserva
          </h1>
        ) : (
          <h1 className="titulo">Cargando tus datos...</h1>
        )}

        <div className="confirmar-grid">
          {/* Columna izquierda - Formulario */}
          <form className="form-col" onSubmit={handleConfirmar}>
            <label>
              Nº WhatsApp:
              <input
                type="tel"
                placeholder="Ej: 2915551234"
                value={telefono}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setTelefono(value);
                }}
                maxLength="10"
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
                <option value="2">2</option>
                <option value="4">4</option>
              </select>
              <p className="precio-total">
                Precio total estimado: $
                {(turno.precio * Number(jugadores)).toLocaleString("es-AR")}
              </p>
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
              {!isFormValid() && (
                <button
                  type="button"
                  className="btn-reservar disabled"
                  disabled
                  onClick={() =>
                    setError(
                      "Por favor completá tu número de WhatsApp correctamente (10 dígitos)."
                    )
                  }
                >
                  Completá los datos para pagar
                </button>
              )}

              {isFormValid() && (
                <MercadoPagoButton
                  monto={turno.precio * Number(jugadores)}
                  descripcion={`Reserva cancha ${turno.cancha} - ${new Date(
                    turno.fecha
                  ).toLocaleDateString("es-AR")} ${turno.hora.slice(0, 5)}hs`}
                  reservaData={{
                    turno_id: turno.id,
                    cantidad_jugadores: jugadores,
                    buscar_pareja: buscoPareja === "true",
                    whatsapp: telefono,
                    necesita_paleta: prestamoPaletas === "true",
                  }}
                  onPagoExitoso={() => navigate("/pago/success")}
                />
              )}
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
  </>
);

};

export default ConfirmarReserva;
