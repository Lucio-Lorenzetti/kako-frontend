import React, { useEffect, useState } from "react";
import "../../styles/Admin/Turnos.css";

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/admin/turnos")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar turnos");
        return res.json();
      })
      .then((data) => {
        setTurnos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleEstadoChange = (id, nuevoEstado) => {
    fetch(`/api/turnos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar el estado");
        return res.json();
      })
      .then((updatedTurno) => {
        setTurnos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t))
        );
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="turnos-container">
      <div className="turnos-card">
        <h2 className="turnos-title">Gestión de Turnos</h2>
        <p className="turnos-description">
          Aquí puedes ver todos los turnos y cambiar su estado.
        </p>

        {loading && <p className="turnos-loading">Cargando turnos...</p>}
        {error && <p className="turnos-error">{error}</p>}

        {!loading && !error && (
          <div className="turnos-table-wrapper">
            <table className="turnos-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cancha</th>
                  <th>Horario</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {turnos.map((turno) => (
                  <tr key={turno.id}>
                    <td>{turno.id}</td>
                    <td>{turno.cancha}</td>
                    <td>{turno.hora}</td>
                    <td>
                      <select
                        value={turno.estado}
                        onChange={(e) =>
                          handleEstadoChange(turno.id, e.target.value)
                        }
                        className={`estado-select ${turno.estado.toLowerCase()}`}
                      >
                        <option value="Disponible">Disponible</option>
                        <option value="Reservado">Reservado</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
