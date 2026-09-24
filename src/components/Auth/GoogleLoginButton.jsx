import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import "../../styles/Auth/GoogleLoginButton.css";

// Espera a que el script de Google Identity Services (cargado en index.html) este listo,
// ya que se carga con "async" y puede no estar disponible todavia al montar el componente.
function esperarGoogleIdentity(callback, maxEsperaMs = 5000) {
  const intervaloMs = 100;
  let esperado = 0;

  const interval = setInterval(() => {
    if (window.google?.accounts?.id) {
      clearInterval(interval);
      callback();
    } else if ((esperado += intervaloMs) >= maxEsperaMs) {
      clearInterval(interval);
      console.warn("Google Identity Services no se pudo cargar.");
    }
  }, intervaloMs);

  return () => clearInterval(interval);
}

// Logo oficial de Google ("G" a 4 colores) para el boton placeholder.
function GoogleGLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

// Boton de "Iniciar sesion con Google". El componente solo intercambia el
// credential de Google por { user, token } contra el backend; no decide si
// guardar la sesion, eso queda a criterio de quien lo use en "onSuccess"
// (ej. Admin valida el rol antes de loguear, Login/Register loguean directo).
export default function GoogleLoginButton({ onSuccess, onError }) {
  const buttonRef = useRef(null);
  const [googleListo, setGoogleListo] = useState(false);

  // Refs para no tener que re-inicializar el boton de Google cada vez que
  // el componente padre pasa un callback nuevo (ej. en cada tecla del form).
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      console.warn("Falta configurar VITE_GOOGLE_CLIENT_ID.");
      return;
    }

    const handleCredentialResponse = async (response) => {
      try {
        const res = await api.post("/auth/google", { id_token: response.credential });
        onSuccessRef.current?.(res.data.user, res.data.token);
      } catch (err) {
        const mensaje = err.response?.data?.error || "No se pudo iniciar sesión con Google.";
        onErrorRef.current?.(mensaje);
      }
    };

    return esperarGoogleIdentity(() => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: 280,
          text: "continue_with",
          locale: "es",
        });
        setGoogleListo(true);
      }
    });
  }, [clientId]);

  return (
    <div className="google-login-wrapper">
      <div
        ref={buttonRef}
        className="google-login-button"
        style={{ display: googleListo ? "block" : "none" }}
      />

      {!googleListo && (
        <button
          type="button"
          className="google-fallback-button"
          onClick={() =>
            onErrorRef.current?.(
              "Iniciar sesión con Google todavía no está disponible."
            )
          }
        >
          <GoogleGLogo />
          <span>Continuar con Google</span>
        </button>
      )}
    </div>
  );
}
