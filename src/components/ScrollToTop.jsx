import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// El layout de la app hace que #root (no la ventana) sea el elemento
// con scroll real (ver Globals.css: html/body/#root con overflow-y).
// React Router no reinicia esa posición al cambiar de ruta, así que
// una página nueva puede "heredar" el scroll de la anterior.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById("root")?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
