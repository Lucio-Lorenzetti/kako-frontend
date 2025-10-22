import React, { useState, useEffect } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import api from "../../api/api";

// Ahora recibe reservaData y un callback opcional onPagoExitoso
const MercadoPagoButton = ({ monto, descripcion, reservaData = {}, onPagoExitoso }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const publicKey = "APP_USR-2f61352b-db3a-4da5-8ce3-8907a8e3d832";

  useEffect(() => {
    try {
      initMercadoPago(publicKey, { locale: "es-AR" });
    } catch (err) {
      console.warn("No se pudo inicializar MercadoPago SDK:", err);
    }
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
          ...reservaData, // Enviamos todos los datos de la reserva
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      setPreferenceId(response.data.id);
    } catch (err) {
      console.error("Error creando preferencia:", err);
      // Si hay un 422 del backend, muestra el mensaje de error de validación
      if (err.response && err.response.data && err.response.data.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(`Error de validación: ${firstError}`);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("No se pudo generar el pago.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Manejar callback al éxito (puede ser invocado por la integración de wallet si se necesita)
  useEffect(() => {
    if (preferenceId && typeof onPagoExitoso === "function") {
      // No llamamos onPagoExitoso automáticamente: la wallet usará su propio flujo.
      // Dejamos el hook por si en el futuro queremos notificar algo al crear la preference.
    }
  }, [preferenceId, onPagoExitoso]);

  return (
    <div>
      {/* Botón de Mercado Pago: mostrar solo si NO existe preferenceId */}
      <div
        className="mp-loading-container"
        aria-hidden={!!preferenceId}
        style={{ display: preferenceId ? "none" : "block" }}
      >
        <button
          type="button"
          onClick={createPreferenceId}
          className="btn-reservar"
          disabled={loading}
        >
          {loading ? "Generando pago..." : "Pagar con Mercado Pago"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Wallet: mostrar solo cuando existe preferenceId */}
      <div id="wallet_container" aria-hidden={!preferenceId} style={{ display: preferenceId ? "block" : "none" }}>
        {preferenceId && <Wallet initialization={{ preferenceId }} />}
      </div>
    </div>
  );
};

export default MercadoPagoButton;