// src/components/Admin/Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Kako Admin</h2>
      <nav className="flex flex-col gap-3">
        <Link to="/admin" className="hover:bg-gray-700 p-2 rounded">Dashboard</Link>
        <Link to="/admin/reservas" className="hover:bg-gray-700 p-2 rounded">Reservas</Link>
        <Link to="/admin/usuarios" className="hover:bg-gray-700 p-2 rounded">Usuarios</Link>
        <Link to="/admin/turnos" className="hover:bg-gray-700 p-2 rounded">Turnos</Link>
        <Link to="/admin/informes" className="hover:bg-gray-700 p-2 rounded">Informes</Link>
        <Link to="/admin/configuracion" className="hover:bg-gray-700 p-2 rounded">Configuración</Link>
      </nav>
    </div>
  );
}
