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
  const [senaInterior, setSenaInterior] = useState("");
  const [senaExterior, setSenaExterior] = useState("");

  // Estado de habilitación de canchas
  const [habilitadoInterior, setHabilitadoInterior] = useState(true);
  const [habilitadoExterior, setHabilitadoExterior] = useState(true);

  // ───────────────────────────────
  // Cargar datos iniciales
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
        setSenaInterior(res.data.sena_interior ?? "");
        setSenaExterior(res.data.sena_exterior ?? "");
      })
      .catch((err) => console.error(err.response?.data || err.message));

    // Traer habilitación de canchas desde localStorage
    const interiorLS = localStorage.getItem("interiorHabilitada");
    const exteriorLS = localStorage.getItem("exteriorHabilitada");
    setHabilitadoInterior(interiorLS === null ? true : interiorLS === "true");
    setHabilitadoExterior(exteriorLS === null ? true : exteriorLS === "true");
  }, []);

  // ───────────────────────────────
  // Alternar habilitación de canchas
  // ───────────────────────────────
  const toggleCancha = (cancha) => {
    if (cancha === "Interior") {
      const nuevoEstado = !habilitadoInterior;
      setHabilitadoInterior(nuevoEstado);
      localStorage.setItem("interiorHabilitada", nuevoEstado);
      alert(
        `La cancha Interior ahora está ${
          nuevoEstado ? "HABILITADA" : "DESHABILITADA"
        }.`
      );
    } else if (cancha === "Exterior") {
      const nuevoEstado = !habilitadoExterior;
      setHabilitadoExterior(nuevoEstado);
      localStorage.setItem("exteriorHabilitada", nuevoEstado);
      alert(
        `La cancha Exterior ahora está ${
          nuevoEstado ? "HABILITADA" : "DESHABILITADA"
        }.`
      );
    }
  };

  // ───────────────────────────────
  // Expansión de filas
  // ───────────────────────────────
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // ───────────────────────────────
  // Guardar precios por cancha con validación
  // ───────────────────────────────
  const handleGuardarPrecio = (cancha) => {
    const setSaving = cancha === "Interior" ? setSavingInterior : setSavingExterior;
    const montoPrecio = parseFloat(cancha === "Interior" ? precioInterior : precioExterior);
    const montoSena = parseFloat(cancha === "Interior" ? senaInterior : senaExterior);

    // VALIDACIÓN: La seña no puede ser mayor al precio
    if (montoSena > montoPrecio) {
      alert(`Error: La seña de la cancha ${cancha} no puede ser mayor al precio total ($${montoPrecio}).`);
      return; // Corta la ejecución aquí
    }

    // VALIDACIÓN OPCIONAL: Evitar números negativos
    if (montoPrecio < 0 || montoSena < 0) {
      alert("Los montos no pueden ser valores negativos.");
      return;
    }

    setSaving(true);
    api
      .put(`/admin/turnos/precio/${cancha}`, { 
        precio: montoPrecio, 
        sena: montoSena 
      })
      .then(() => {
        alert(`Configuración de cancha ${cancha} actualizada correctamente`);
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

      {/* Precios y habilitación */}
      <div className="general-card precio-card">
        <h3 className="general-title">Turnos</h3>
        <div className="general-table-wrapper">
          <table className="general-table">
            <thead>
              <tr>
                <th>Cancha</th>
                <th>Estado</th>
                <th>Precio Total</th>
                <th>Seña Requerida</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {/* FILA INTERIOR */}
              <tr>
            <td>Interior</td>
            <td>
              <button
                onClick={() => toggleCancha("Interior")}
                className={`btn-secondary ${habilitadoInterior ? "habilitada" : "deshabilitada"}`}
              >
                {habilitadoInterior ? "Habilitada" : "Deshabilitada"}
              </button>
            </td>
            <td>
              {/* Contenedor para el símbolo pegado al input */}
              <div className="input-symbol-wrapper">
                <span className="input-symbol">$</span>
                <input
                  type="number"
                  value={precioInterior}
                  onChange={(e) => setPrecioInterior(e.target.value)}
                  className="input-tablas" 
                />
              </div>
            </td>
            <td>
              <div className="input-symbol-wrapper">
                <span className="input-symbol">$</span>
                <input
                  type="number"
                  value={senaInterior}
                  onChange={(e) => setSenaInterior(e.target.value)}
                  className={`input-tablas ${parseFloat(senaInterior) > parseFloat(precioInterior) ? "input-error" : ""}`}
                />
              </div>
            </td>
            <td>
              <button
                onClick={() => handleGuardarPrecio("Interior")}
                className="btn-primary"
                disabled={savingInterior}
              >
                {savingInterior ? "Guardando..." : "Guardar"}
              </button>
            </td>
          </tr>
              {/* FILA EXTERIOR (Repite la misma lógica de "input-with-symbol") */}
              <tr>
            <td>Exterior</td>
            <td>
              <button
                onClick={() => toggleCancha("Exterior")}
                className={`btn-secondary ${habilitadoExterior ? "habilitada" : "deshabilitada"}`}
              >
                {habilitadoExterior ? "Habilitada" : "Deshabilitada"}
              </button>
            </td>
            <td>
              {/* Contenedor para el símbolo pegado al input */}
              <div className="input-symbol-wrapper">
                <span className="input-symbol">$</span>
                <input
                  type="number"
                  value={precioExterior}
                  onChange={(e) => setPrecioExterior(e.target.value)}
                  className="input-tablas" 
                />
              </div>
            </td>
            <td>
              <div className="input-symbol-wrapper">
                <span className="input-symbol">$</span>
                <input
                  type="number"
                  value={senaExterior}
                  onChange={(e) => setSenaExterior(e.target.value)}
                  className={`input-tablas ${parseFloat(senaExterior) > parseFloat(precioExterior) ? "input-error" : ""}`}
                />
              </div>
            </td>
            <td>
              <button
                onClick={() => handleGuardarPrecio("Exterior")}
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
