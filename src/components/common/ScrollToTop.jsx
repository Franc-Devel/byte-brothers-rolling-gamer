import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Componente que restablece la posición del scroll de la ventana a la parte superior (0, 0)
 * cada vez que cambia la ruta en la aplicación (SPA).
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
