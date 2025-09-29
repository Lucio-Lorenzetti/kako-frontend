import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/Admin/Usuarios.css";

export default function Usuarios() {
  console.log("Usuarios se está montando");
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/admin/usuarios")
  .then((res) => {
    console.log("Usuarios recibidos:", res.data);
    setUsuarios(res.data);
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
      .then((res) => {
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

  return (
    <div className="usuarios-container">
      <div className="usuarios-card">
        <h2 className="usuarios-title">Gestión de Usuarios</h2>
        <p className="usuarios-description">
          Aquí puedes ver todos los usuarios y modificar su rol o estado.
        </p>

        {loading && <p className="usuarios-loading">Cargando usuarios...</p>}
        {error && <p className="usuarios-error">{error}</p>}

        {!loading && !error && (
          <div className="usuarios-table-wrapper">
            <table className="usuarios-table">
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
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.name}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <select
                        value={usuario.role}
                        onChange={(e) =>
                          handleUsuarioChange(
                            usuario.id,
                            "role",
                            e.target.value
                          )
                        }
                        className={`rol-select ${
                          usuario.role?.toLowerCase() || ""
                        }`}
                      >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={usuario.estado}
                        onChange={(e) =>
                          handleUsuarioChange(
                            usuario.id,
                            "estado",
                            e.target.value
                          )
                        }
                        className={`estado-select ${
                          usuario.estado?.toLowerCase() || ""
                        }`}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
