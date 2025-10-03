import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/Admin/Turnos.css";
import "../../styles/Admin/GlobalsAdmin.css";

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const [selectedCancha, setSelectedCancha] = useState(""); // filtro cancha
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  useEffect(() => {
    api
      .get("/admin/turnos")
      .then((res) => {
        setTurnos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error API:", err.response?.data || err.message);
        setError("Error al cargar turnos");
        setLoading(false);
      });
  }, []);

  const handleEstadoChange = (id, nuevoEstado) => {
    api
      .put(`/admin/turnos/${id}`, { estado: nuevoEstado })
      .then(() => {
        setTurnos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t))
        );
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Error al actualizar el estado del turno");
      });
  };

  // Obtener listado de canchas únicas
  const canchas = [...new Set(turnos.map((t) => t.cancha))];

  // Filtrado por fecha y cancha
  const filteredTurnos = turnos.filter((t) => {
    const matchDate = searchDate
      ? new Date(t.fecha).toISOString().slice(0, 10) === searchDate
      : true;
    const matchCancha = selectedCancha ? t.cancha === selectedCancha : true;
    return matchDate && matchCancha;
  });

  // Paginación
  const totalItems = filteredTurnos.length;
  const totalPages = perPage === "all" ? 1 : Math.ceil(totalItems / perPage);
  const displayedTurnos =
    perPage === "all"
      ? filteredTurnos
      : filteredTurnos.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="turnos-container">
      <div className="general-card">
        <h2 className="general-title">Gestión de Turnos</h2>
        <p className="general-description">
          Aquí puedes ver todos los turnos y cambiar su estado.
        </p>
        {/* Filtros */}
        <div className="general-filters">
          <label>
            Filtrar por fecha:{" "}
            <input
              type="date"
              value={searchDate}
              onChange={(e) => {
                setSearchDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </label>

          <label>
            Filtrar por cancha:{" "}
            <select
              value={selectedCancha}
              onChange={(e) => {
                setSelectedCancha(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Todas</option>
              {canchas.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label>
            Turnos por página:{" "}
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(e.target.value === "all" ? "all" : parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[8, 16, 24, 32, 40, 48, 56, "all"].map((n) => (
                <option key={n} value={n}>
                  {n === "all" ? "Todos" : n}
                </option>
              ))}
            </select>
          </label>

          {/* Paginación arriba, al lado de los filtros */}
          {perPage !== "all" && totalPages > 1 && (
            <div className="general-pagination-inline">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                ◀
              </button>
              <span>
                {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                ▶
              </button>
            </div>
          )}
        </div>

        {loading && <p className="turnos-loading">Cargando turnos...</p>}
        {error && <p className="turnos-error">{error}</p>}

        {!loading && !error && (
          <div className="general-table-wrapper">
            <table className="general-table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Horario</th>
                  <th>Cancha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {displayedTurnos.map((turno) => (
                  <tr key={turno.id}>
                    <td>
                      {turno.fecha
                        ? (() => {
                            const [year, month, day] = turno.fecha.split("T")[0].split("-");
                            return `${day}-${month}`;
                          })()
                        : ""}
                    </td>
                    <td>
                      {turno.hora
                        ? turno.hora.split(":").slice(0, 2).join(":")
                        : ""}
                    </td>
                    <td>{turno.cancha}</td>
                    <td>
                      <select
                        value={turno.estado}
                        onChange={(e) =>
                          handleEstadoChange(turno.id, e.target.value)
                        }
                        className={`estado-select ${
                          turno.estado?.toLowerCase() || ""
                        }`}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="reservado">Reservado</option>
                        <option value="inactivo">Inactivo</option>
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
