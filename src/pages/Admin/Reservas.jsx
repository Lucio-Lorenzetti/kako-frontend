// src/pages/Admin/Reservas.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/Admin/GlobalsAdmin.css";
import "../../styles/Admin/Reservas.css";

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   // Filtros
  const [searchDate, setSearchDate] = useState("");
  const [selectedCancha, setSelectedCancha] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  useEffect(() => {
    api
      .get("/admin/reservas") // ahora el backend devuelve solo hoy + próximos 6 días, ordenado
      .then((res) => {
        // Respaldo: si por alguna razón vienen sin ordenar, ordenamos cliente-side
        const sorted = (res.data || []).slice().sort((a, b) => {
          const fa = (a.fecha || "").slice(0, 10);
          const fb = (b.fecha || "").slice(0, 10);
          if (fa === fb) {
            // comparar horas (HH:MM:SS)
            const ha = (a.hora || "00:00:00").slice(0, 8);
            const hb = (b.hora || "00:00:00").slice(0, 8);
            return ha.localeCompare(hb);
          }
          return fa.localeCompare(fb);
        });

        setReservas(sorted);
        setLoading(false);
      })
      .catch((err) => {
          console.error("Error completo:", err); // log entero
          console.error("Respuesta:", err.response);
          console.error("Data:", err.response?.data);
          setError("Error al cargar reservas");
          setLoading(false);
              });
  }, []);

  // Listado de canchas únicas para el filtro
  const canchas = [...new Set(reservas.map((r) => r.cancha || ""))];

  // Filtrado
  const filteredReservas = reservas.filter((r) => {
    const matchDate = searchDate ? r.fecha?.slice(0, 10) === searchDate : true;
    const matchCancha = selectedCancha ? r.cancha === selectedCancha : true;
    return matchDate && matchCancha;
  });

  // Paginación
  const totalItems = filteredReservas.length;
  const totalPages = perPage === "all" ? 1 : Math.ceil(totalItems / perPage);
  const displayedReservas =
  perPage === "all"
    ? filteredReservas
    : filteredReservas.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
      );


  return (
    <div className="reservas-container">
      <div className="general-card reservas-card">
        <h2 className="general-title">Gestión de Reservas</h2>
        <p className="general-description">
          Aquí podrás ver y administrar todas las reservas de hoy y los próximos 6 días.
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
            Reservas por página:{" "}
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(
                  e.target.value === "all" ? "all" : parseInt(e.target.value)
                );
                setCurrentPage(1);
              }}
            >
              {[8, 16, 24, 32, "all"].map((n) => (
                <option key={n} value={n}>
                  {n === "all" ? "Todos" : n}
                </option>
              ))}
            </select>
          </label>

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
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                ▶
              </button>
            </div>
          )}
        </div>

        {loading && <p className="reservas-loading">Cargando reservas...</p>}
        {error && <p className="reservas-error">{error}</p>}

        {!loading && !error && (
          <div className="general-table-wrapper">
            <table className="general-table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Hora</th>
                  <th>Cancha</th>
                  <th>Usuario</th>
                  <th>Jugadores</th>
                  <th>Buscar Pareja</th>
                  <th>Celular</th>
                </tr>
              </thead>
              <tbody>
                {displayedReservas.length > 0 ? (
                  displayedReservas.map((reserva) => {
                    const fechaStr = reserva.fecha ? reserva.fecha.slice(0, 10) : "";
                    const [year, month, day] = fechaStr ? fechaStr.split("-") : ["", "", ""];
                    const diaFormateado = day && month ? `${day}-${month}` : "";
                    const horaFormateada = reserva.hora ? reserva.hora.slice(0, 5) : "";

                    return (
                      <tr key={reserva.id}>
                        <td>{diaFormateado}</td>
                        <td>{horaFormateada}</td>
                        <td>{reserva.cancha}</td>
                        <td>{reserva.usuario?.nombre ?? reserva.nombre_jugador ?? "—"}</td>
                        <td>{reserva.cantidad_jugadores ?? "—"}</td>
                        <td>
                          {reserva.buscar_pareja === null || reserva.buscar_pareja === undefined
                            ? "—" : reserva.buscar_pareja
                            ? "Sí"
                            : "No"}
                        </td>
                        <td>{reserva.usuario?.celular ?? reserva.whatsapp ?? "—"}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5">No hay reservas en los próximos 7 días</td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}
