import { useState } from "react";
import api from "../../api/api";
import "../../styles/Account/CambiarPassword.css";

// Mismo formulario para admin y usuario comun: el endpoint /me/password
// no depende del rol, solo del token del usuario logueado.
export default function CambiarPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 8) {
      setError("La contraseña nueva debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("La confirmación no coincide con la contraseña nueva.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.put("/me/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      setSuccess(response.data.message || "Contraseña actualizada correctamente");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const data = err.response?.data;

      if (data?.error) {
        // Caso puntual: "La contraseña actual no es correcta"
        setError(data.error);
      } else if (data?.errors) {
        const primerError = Object.values(data.errors)[0][0];
        setError(primerError);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("No se pudo actualizar la contraseña. Intentá de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="cambiar-password-form" onSubmit={handleSubmit}>
      <label>
        Contraseña actual
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </label>

      <label>
        Contraseña nueva
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          required
        />
      </label>

      <label>
        Confirmar contraseña nueva
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={8}
          required
        />
      </label>

      {error && <p className="cambiar-password-error">{error}</p>}
      {success && <p className="cambiar-password-success">{success}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Cambiar contraseña"}
      </button>
    </form>
  );
}
