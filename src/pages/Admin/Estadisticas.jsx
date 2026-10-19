// src/pages/Admin/Estadisticas.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Admin/Estadisticas.css";
import "../../styles/Admin/GlobalsAdmin.css";

export default function Estadisticas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role !== "developer") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.role !== "developer") return;

    api
      .get("/admin/estadisticas/uso-sistema")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error API:", err.response?.data || err.message);
        setError("Error al cargar las estadísticas");
        setLoading(false);
      });
  }, [user]);

  if (!user || user.role !== "developer") return null;

  const cards = stats && [
    {
      label: "Reservas de clientes (total histórico)",
      value: stats.reservas_cliente_total,
      hint: "Reservas pagadas online desde que existe el sistema.",
    },
    {
      label: "Turnos reservados por clientes (ahora)",
      value: stats.turnos_reservados_cliente_actual,
      hint: "Turnos actualmente reservados con un pago real detrás.",
    },
    {
      label: "Turnos cargados a mano (ahora)",
      value: stats.turnos_reservados_manual_actual,
      hint: "Turnos actualmente reservados sin pago, cargados por un admin.",
    },
  ];

  return (
    <div className="estadisticas-container">
      <div className="general-card">
        <h2 className="general-title">Estadísticas</h2>
        <p className="general-description">
          Uso real del sistema: reservas de clientes vs. cargas manuales.
        </p>

        {loading && <p className="estadisticas-loading">Cargando estadísticas...</p>}
        {error && <p className="estadisticas-error">{error}</p>}

        {!loading && !error && cards && (
          <div className="estadisticas-grid">
            {cards.map((card) => (
              <div className="estadisticas-stat-card" key={card.label}>
                <span className="estadisticas-stat-value">{card.value}</span>
                <span className="estadisticas-stat-label">{card.label}</span>
                <span className="estadisticas-stat-hint">{card.hint}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
