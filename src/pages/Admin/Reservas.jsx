// src/pages/Admin/Reservas.jsx
import React, { useEffect, useState } from "react";
import "../../styles/Admin/Reservas.css";

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/admin/reservas") // Cambiar por tu endpoint real
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener las reservas");
        return res.json();
      })
      .then((data) => {
        setReservas(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="reservas-container">
      <div className="reservas-card">
        <h2 className="reservas-title">Gestión de Reservas</h2>
        <p className="reservas-description">
          Aquí podrás ver y administrar todas las reservas.
        </p>

        {loading && <p className="reservas-loading">Cargando reservas...</p>}
        {error && <p className="reservas-error">{error}</p>}

        {!loading && !error && (
          <div className="reservas-table-wrapper">
            <table className="reservas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Turno</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td>{reserva.id}</td>
                    <td>{reserva.nombre}</td>
                    <td>{reserva.turno}</td>
                    <td>{reserva.fecha}</td>
                    <td className={`estado ${reserva.estado.toLowerCase()}`}>
                      {reserva.estado}
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
