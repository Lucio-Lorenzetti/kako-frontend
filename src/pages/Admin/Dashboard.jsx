// src/pages/Admin/Dashboard.jsx
import React from 'react';
import '../../styles/Admin/Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="dashboard-content">
        <div className="dashboard-card">📅 Reservas de hoy</div>
        <div className="dashboard-card">👥 Nuevos usuarios</div>
        <div className="dashboard-card">💰 Ingresos</div>
      </div>
    </div>
  );
}
