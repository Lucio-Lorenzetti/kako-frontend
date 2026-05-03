import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/Admin/Turnos.css";
import "../../styles/Admin/GlobalsAdmin.css";

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const [selectedCancha, setSelectedCancha] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  // 1. Definimos los horarios originales según tu lista
  const horariosOriginales = [
    "13:00", "14:30", "16:00", "17:30", 
    "18:00", "19:30", "21:00", "22:30"
  ];

  const fetchTurnos = () => {
    setLoading(true);
    api
      .get("/admin/turnos")
      .then((res) => {
        setTurnos(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al cargar turnos");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  const handleEstadoChange = (id, nuevoEstado) => {
    api
      .put(`/admin/turnos/${id}`, { estado: nuevoEstado })
      .then(() => {
        setTurnos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t))
        );
      })
      .catch(() => alert("Error al actualizar el estado"));
  };

  const handleAjusteHorario = (id, esRetrasado) => {
    const accion = esRetrasado ? "adelantar" : "retrasar";
    const mensaje = esRetrasado 
      ? "¿Deseas volver al horario ORIGINAL?" 
      : "¿Deseas RETRASAR 30 minutos?";

    if (!window.confirm(mensaje)) return;

    api
      .post(`/admin/turnos/${id}/${accion}`)
      .then((res) => {
        alert(res.data.message);
        fetchTurnos();
      })
      .catch(() => alert("Error al ajustar los horarios"));
  };

  const canchas = [...new Set(turnos.map((t) => t.cancha).filter(Boolean))];

  const filteredTurnos = turnos
    .filter((t) => {
      if (!t.fecha) return false;
      const fechaTurno = t.fecha.split("T")[0];
      const matchDate = searchDate ? fechaTurno === searchDate : true;
      const matchCancha = selectedCancha ? t.cancha === selectedCancha : true;
      return matchDate && matchCancha;
    })
    .sort((a, b) => {
      if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
      return (a.hora || "").localeCompare(b.hora || "");
    });

  const totalItems = filteredTurnos.length;
  const itemsPerPage = perPage === "all" ? totalItems : perPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const displayedTurnos =
    perPage === "all"
      ? filteredTurnos
      : filteredTurnos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="turnos-container">
      <div className="general-card">
        <h2 className="general-title">Gestión de Turnos</h2>
        
        <div className="general-filters">
          <label>Fecha: <input type="date" value={searchDate} onChange={(e) => { setSearchDate(e.target.value); setCurrentPage(1); }} /></label>
          <label>Cancha: 
            <select value={selectedCancha} onChange={(e) => { setSelectedCancha(e.target.value); setCurrentPage(1); }}>
              <option value="">Todas</option>
              {canchas.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>Por página: 
            <select value={perPage} onChange={(e) => { setPerPage(e.target.value === "all" ? "all" : parseInt(e.target.value)); setCurrentPage(1); }}>
              {[8, 16, 32, 48, "all"].map((n) => <option key={n} value={n}>{n === "all" ? "Todos" : n}</option>)}
            </select>
          </label>

          {perPage !== "all" && totalPages > 1 && (
            <div className="general-pagination-inline">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>{"<"}</button>
              <span>{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>{">"}</button>
            </div>
          )}
        </div>

        {!loading && !error && (
          <div className="general-table-wrapper">
            <table className="general-table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Horario</th>
                  <th>Cancha</th>
                  <th>Estado</th>
                  <th>Ajustar</th>
                </tr>
              </thead>
              <tbody>
                {displayedTurnos.map((turno) => {
                  // 2. LÓGICA DE DETECCIÓN EN FRONT:
                  const horaLimpia = turno.hora ? turno.hora.slice(0, 5) : "";
                  // Si la hora NO está en la lista de originales, consideramos que es "retrasado"
                  const estaRetrasado = !horariosOriginales.includes(horaLimpia);

                  return (
                    <tr key={turno.id}>
                      <td>{turno.fecha ? turno.fecha.split("T")[0].split("-").reverse().slice(0, 2).join("/") : "-"}</td>
                      <td>
                        <strong style={{ color: estaRetrasado ? '#e62222' : 'inherit' }}>
                          {horaLimpia}
                        </strong>
                        {estaRetrasado && (
                          <span style={{ fontSize: '10px', display: 'block', color: '#e62222', fontWeight: 'bold' }}>
                            AJUSTADO
                          </span>
                        )}
                      </td>
                      <td>{turno.cancha}</td>
                      <td>
                        <select value={turno.estado} onChange={(e) => handleEstadoChange(turno.id, e.target.value)} className={`estado-select ${turno.estado?.toLowerCase() || ""}`}>
                          <option value="disponible">Disponible</option>
                          <option value="reservado">Reservado</option>
                          <option value="inactivo">Inactivo</option>
                        </select>
                      </td>
                      <td>
                        <button 
                          className="estado-select"
                          onClick={() => handleAjusteHorario(turno.id, estaRetrasado)}
                          style={{
                            backgroundColor: estaRetrasado ? 'rgb(83, 83, 83)' : 'var(--color-padel)',
                            color: 'white',
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          {estaRetrasado ? "Original" : "Retrasar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}