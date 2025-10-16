import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MercadoPagoButton from "../../components/Home/MercadoPagoButton";
import api from "../../api/api";
import Header from "../../components/Auth/Header";
import "../../styles/User/ConfirmarReserva.css";

const ConfirmarReserva = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
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

  // Función de validación para habilitar el botón de Mercado Pago
  const isFormValid = () => {
        // Validación básica de turno y monto
        if (!turno || !turno.id || (turno.precio * Number(jugadores)) <= 0) {
            return false;
        }

        // Validación de WhatsApp (requerido por el backend)
        const phoneRegex = /^\d{10}$/; 
        if (!telefono || !phoneRegex.test(telefono)) {
            return false;
        }

        return true;
    };

    // La función handleConfirmar ya no se usa para pagar, pero la dejamos por si la necesitas más tarde.
  const handleConfirmar = async (e) => {
    e.preventDefault();
    // ... Lógica de reserva sin pago (si la necesitas) ...
  };


  if (!turno) {
    return <p>No se encontró información del turno seleccionado.</p>;
  }

   return (
    <>
      <Header />
    <section className="confirmar-container">
      <div className="confirmar-card">
        <h1 className="titulo">Hola {user?.name}, confirmá tu reserva</h1>

        <div className="confirmar-grid">
          {/* Columna izquierda - Formulario */}
          <form className="form-col" onSubmit={(e) => e.preventDefault()}> {/* Ya no hace submit */}
            <label>
            Nº WhatsApp:
            <input
                type="tel"
                placeholder="Ej: 2915551234"
                value={telefono}
                onChange={(e) => {
                    setTelefono(e.target.value);
                    setError(null); // Limpiar error al escribir
                }}
                pattern="^\d{10}$"       
                maxLength="10"           
                required
                title="Debe contener exactamente 10 dígitos (sin espacios, sin +54, solo el número)"
            />
            </label>

            {/* ... resto de los campos ... */}
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
                Precio total estimado: ${turno.precio * Number(jugadores)}
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
                        onClick={() => setError("Por favor completa tu número de WhatsApp correctamente (10 dígitos).")}
                    >
                        Completá los datos para pagar
                    </button>
                )}

                {isFormValid() && (
                    <MercadoPagoButton
                        monto={turno.precio * Number(jugadores)} // Aseguramos que sea número
                        descripcion={`Reserva cancha ${turno.cancha} - ${new Date(turno.fecha).toLocaleDateString("es-AR")} ${turno.hora.slice(0, 5)}hs`}
                        // Pasamos todos los datos requeridos por la validación de Laravel
                        reservaData={{
                            turno_id: turno.id,
                            cantidad_jugadores: jugadores,
                            buscar_pareja: buscoPareja === "true",
                            whatsapp: telefono,
                            necesita_paleta: prestamoPaletas === "true",
                        }}
                        onPagoExitoso={() => navigate("/pago/success")} // Redirección al éxito
                    />
                )}
            </div>
          </form>
          {/* ... Columna derecha - Info turno ... */}
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