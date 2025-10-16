import React, { useState, useEffect } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import api from "../../api/api";

// Ahora recibe reservaData
const MercadoPagoButton = ({ monto, descripcion, reservaData }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const publicKey = "APP_USR-2f61352b-db3a-4da5-8ce3-8907a8e3d832";

  useEffect(() => {
    initMercadoPago(publicKey, { locale: "es-AR" });
  }, []);

  const createPreferenceId = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await api.post(
        "/mercadopago/preference",
        { 
            monto, 
            descripcion,
            ...reservaData // Enviamos todos los datos de la reserva
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      setPreferenceId(response.data.id);
    } catch (err) {
      console.error("Error creando preferencia:", err);
        // Si hay un 422 del backend, muestra el mensaje de error de validación
        if (err.response && err.response.data.errors) {
            const firstError = Object.values(err.response.data.errors)[0][0];
            setError(`Error de validación: ${firstError}`);
        } else {
            setError("No se pudo generar el pago.");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!preferenceId && (
        <button
            type="button" 
            onClick={createPreferenceId}
            className="btn-reservar"
            disabled={loading}
            >
            {loading ? "Generando pago..." : "Pagar con Mercado Pago"}
        </button>
      )}

      {error && <p className="error">{error}</p>}

      {preferenceId && <Wallet initialization={{ preferenceId }} />}
    </div>
  );
};

export default MercadoPagoButton;