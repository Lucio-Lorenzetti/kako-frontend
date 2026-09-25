import React, { useState, useEffect } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import api from "../../api/api";

const MercadoPagoButton = ({ monto, descripcion, reservaData = {}, onBeforePago }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;

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

      // Guardamos los datos de la reserva ANTES de mandar al usuario a pagar: la
      // pantalla de exito (/pago/success) los necesita para armar el mensaje de
      // WhatsApp sin depender de que el webhook del backend ya haya confirmado el pago.
      if (typeof onBeforePago === "function") {
        onBeforePago();
      }

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
      const data = err.response?.data;
      // Reglas de negocio del backend (ej. "esta cancha solo admite 4 jugadores")
      if (data?.error) {
        setError(data.error);
      } else if (data?.errors) {
        // Si hay un 422 del backend, muestra el mensaje de error de validación
        const firstError = Object.values(data.errors)[0][0];
        setError(`Error de validación: ${firstError}`);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("No se pudo generar el pago.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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

      <div id="wallet_container" aria-hidden={!preferenceId} style={{ display: preferenceId ? "block" : "none" }}>
        {preferenceId && <Wallet initialization={{ preferenceId }} />}
      </div>
    </div>
  );
};

export default MercadoPagoButton;