import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const AuthContext = createContext(null);

// El backend usa Laravel Sanctum con Bearer tokens (no cookies), asi que
// la sesion se reconstruye aca en el front: al montar la app, si hay un
// token guardado se valida contra /me antes de dejar pasar a cualquier
// pantalla, para no mostrar un flash de "no logueado" en un refresh.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/me")
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
    // Solo debe correr una vez, al montar la app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (token, userData = null) => {
    localStorage.setItem("token", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="auth-splash">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }
  return ctx;
};
