import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/Admin/Dashboard.css";
import "../../styles/Admin/GlobalsAdmin.css";

export default function Dashboard() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Precios por cancha
  const [precioInterior, setPrecioInterior] = useState("");
  const [precioExterior, setPrecioExterior] = useState("");
  const [savingInterior, setSavingInterior] = useState(false);
  const [savingExterior, setSavingExterior] = useState(false);

  // ───────────────────────────────
  // Cargar reservas y precios
  // ───────────────────────────────
  useEffect(() => {
    // Traer reservas de hoy
    api
      .get("/admin/reservas/hoy")
      .then((res) => {
        setReservas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        setError("Error al cargar reservas de hoy");
        setLoading(false);
      });

    // Traer precios actuales
    api
      .get("/admin/precios")
      .then((res) => {
        setPrecioInterior(res.data.interior ?? "");
        setPrecioExterior(res.data.exterior ?? "");
      })
      .catch((err) => console.error(err.response?.data || err.message));
  }, []);

  // ───────────────────────────────
  // Expansión de filas
  // ───────────────────────────────
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // ───────────────────────────────
  // Guardar precios por cancha
  // ───────────────────────────────
  const handleGuardarPrecio = (cancha, monto) => {
    const setSaving =
      cancha === "Interior" ? setSavingInterior : setSavingExterior;
    setSaving(true);

    api
      .put(`/admin/turnos/precio/${cancha}`, { precio: monto })
      .then(() => {
        alert(`✅ Precio de cancha ${cancha} actualizado correctamente`);
        return api.get("/admin/precios");
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Error al actualizar el precio");
      })
      .finally(() => setSaving(false));
  };

  // ───────────────────────────────
  // Render principal
  // ───────────────────────────────
  return (
    <div className="dashboard-container">
      {/* Reservas de hoy */}
      <div className="general-card">
        <h3 className="general-title">Reservas de hoy</h3>
        {loading && <p>Cargando reservas...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && reservas.length === 0 && (
          <p>No hay reservas hoy.</p>
        )}
        {!loading && !error && reservas.length > 0 && (
          <table className="general-table">
            <thead>
              <tr>
                <th>Horario</th>
                <th>Cancha</th>
                <th>Usuario</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <React.Fragment key={reserva.id}>
                  <tr>
                    <td
                      className="cursor-pointer font-semibold"
                      onClick={() => toggleExpand(reserva.id)}
                    >
                      {reserva.turno?.hora?.slice(0, 5) || "—"}
                    </td>
                    <td>{reserva.turno?.cancha || "—"}</td>
                    <td>
                      {reserva.user?.nombre ??
                        reserva.nombre_jugador ??
                        "—"}
                    </td>
                    <td>
                      <button
                        onClick={() => toggleExpand(reserva.id)}
                        className="btn-secondary"
                      >
                        {expandedId === reserva.id
                          ? "Ocultar"
                          : "Ver detalles"}
                      </button>
                    </td>
                  </tr>
                  {expandedId === reserva.id && (
                    <tr>
                      <td colSpan="4" className="expanded-info">
                        <p>
                          <strong>Horario:</strong> {reserva.turno?.hora}
                        </p>
                        <p>
                          <strong>Cancha:</strong> {reserva.turno?.cancha}
                        </p>
                        <p>
                          <strong>Jugadores:</strong>{" "}
                          {reserva.cantidad_jugadores}
                        </p>
                        <p>
                          <strong>Paletas:</strong>{" "}
                          {reserva.prestar_paletas ? "Sí" : "No"}
                        </p>
                        <p>
                          <strong>Buscar pareja:</strong>{" "}
                          {reserva.buscar_pareja ? "Sí" : "No"}
                        </p>
                        <p>
                          <strong>Usuario:</strong>{" "}
                          {reserva.user?.nombre ??
                            reserva.nombre_jugador ??
                            "—"}
                        </p>
                        <p>
                          <strong>WhatsApp:</strong>{" "}
                          {reserva.user?.celular ??
                            reserva.whatsapp ??
                            "—"}
                        </p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Precios */}
      <div className="general-card precio-card">
        <h3 className="general-title">Precios por Turno (por Jugador)</h3>
        <div className="general-table-wrapper">
          <table className="general-table">
            <thead>
              <tr>
                <th>Cancha</th>
                <th>Precio ($)</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Interior</td>
                <td className="general-filters">
                  <input
                    type="number"
                    value={precioInterior}
                    onChange={(e) => setPrecioInterior(e.target.value)}
                    className="input-precio"
                  />
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleGuardarPrecio("Interior", precioInterior)
                    }
                    className="btn-primary"
                    disabled={savingInterior}
                  >
                    {savingInterior ? "Guardando..." : "Guardar"}
                  </button>
                </td>
              </tr>
              <tr>
                <td>Exterior</td>
                <td className="general-filters">
                  <input
                    type="number"
                    value={precioExterior}
                    onChange={(e) => setPrecioExterior(e.target.value)}
                    className="input-precio"
                  />
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleGuardarPrecio("Exterior", precioExterior)
                    }
                    className="btn-primary"
                    disabled={savingExterior}
                  >
                    {savingExterior ? "Guardando..." : "Guardar"}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
