// src/pages/Admin/Usuarios.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/Admin/Usuarios.css";
import "../../styles/Admin/GlobalsAdmin.css";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  useEffect(() => {
    api
      .get("/admin/usuarios")
      .then((res) => {
        // Validación de array para evitar crashes
        setUsuarios(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error API:", err.response?.data || err.message);
        setError("Error al cargar usuarios");
        setLoading(false);
      });
  }, []);

  const handleUsuarioChange = (id, campo, valor) => {
    api
      .put(`/admin/usuarios/${id}`, { [campo]: valor })
      .then(() => {
        setUsuarios((prev) =>
          prev.map((u) => (u.id === id ? { ...u, [campo]: valor } : u))
        );
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Error al actualizar usuario");
      });
  };

  const handleEliminarUsuario = (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;

    api
      .delete(`/admin/usuarios/${id}`)
      .then(() => {
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Error al eliminar usuario");
      });
  };

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO ---
  
  // 1. Filtrar por búsqueda
  const filtered = usuarios.filter((u) => {
    const nombreCompleto = `${u.name || ""} ${u.apellido || ""}`.toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase());
  });

  // 2. Ordenar: Admins primero, luego alfabético
  const sortedUsuarios = [...filtered].sort((a, b) => {
    const pesoRol = { admin: 1, user: 2 };
    
    const rolA = a.role?.toLowerCase() || "user";
    const rolB = b.role?.toLowerCase() || "user";

    // Si los roles son diferentes, ponemos el de menor peso (admin) arriba
    if (pesoRol[rolA] !== pesoRol[rolB]) {
      return pesoRol[rolA] - pesoRol[rolB];
    }

    // Si son del mismo rol, orden alfabético por nombre
    const nombreA = a.name?.toLowerCase() || "";
    const nombreB = b.name?.toLowerCase() || "";
    return nombreA.localeCompare(nombreB);
  });

  // --- LÓGICA DE PAGINACIÓN ---
  const totalItems = sortedUsuarios.length;
  const itemsPerPage = perPage === "all" ? totalItems : perPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  const displayedUsuarios =
    perPage === "all"
      ? sortedUsuarios
      : sortedUsuarios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="usuarios-container">
      <div className="general-card">
        <h2 className="general-title">Gestión de Usuarios</h2>
        <p className="general-description">
          Administrá los roles y estados de los usuarios registrados.
        </p>

        {/* Filtros Centrados */}
        <div className="general-filters">
          <label>
            Buscar por nombre o apellido:{" "}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </label>

          <label>
            Mostrar:
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(e.target.value === "all" ? "all" : parseInt(e.target.value));
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

          {/* Paginación Inline */}
          {perPage !== "all" && totalPages > 1 && (
            <div className="general-pagination-inline">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                ◀
              </button>
              <span>
                {currentPage} / {totalPages}
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

        {loading && <p className="usuarios-loading">Cargando usuarios...</p>}
        {error && <p className="usuarios-error">{error}</p>}

        {!loading && !error && (
          <div className="general-table-wrapper">
            <table className="general-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsuarios.length > 0 ? (
                  displayedUsuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.name} {usuario.apellido ?? ""}</td>
                      <td>{usuario.email}</td>
                      <td>
                        <select
                          value={usuario.role}
                          onChange={(e) =>
                            handleUsuarioChange(usuario.id, "role", e.target.value)
                          }
                          className={`estado-select ${usuario.role?.toLowerCase() || ""}`}
                        >
                          <option value="user">Usuario</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={usuario.estado}
                          onChange={(e) =>
                            handleUsuarioChange(usuario.id, "estado", e.target.value)
                          }
                          className={`estado-select ${usuario.estado?.toLowerCase() || ""}`}
                        >
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="usuarios-delete-btn"
                          onClick={() => handleEliminarUsuario(usuario.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No se encontraron usuarios</td>
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