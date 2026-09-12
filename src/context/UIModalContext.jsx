/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";

const CONTENIDOS = {
  noticias: {
    titulo: "Noticias y Actualizaciones",
    cuerpo: (
      <div>
        <h6 className="text-info">🔥 Lanzamientos de Temporada</h6>
        <p>Se incorporaron títulos AAA al catálogo digital con especificaciones técnicas detalladas y galería de capturas.</p>
        <h6 className="text-info">🛠️ Parche y Optimización v1.2</h6>
        <p>Mejoras de rendimiento en el filtrado por categorías y sincronización fluida de la lista de deseos en LocalStorage.</p>
        <p className="text-muted small">Nota: Plataforma académica demostrativa desarrollada con fines educativos.</p>
      </div>
    )
  },
  ayuda: {
    titulo: "Centro de Ayuda y Preguntas Frecuentes",
    cuerpo: (
      <div>
        <p><strong>¿Cómo guardo un juego en mi lista de deseos?</strong><br />Iniciá sesión y presioná el botón de marcador en cualquier tarjeta de juego.</p>
        <p><strong>¿Cómo publicar una reseña?</strong><br />Accedé a la ficha de detalle de cualquier título con tu cuenta abierta y dejá tu voto positivo o negativo.</p>
        <p><strong>¿Necesitás asistencia técnica?</strong><br />Contactanos vía correo electrónico a: <span className="text-info">soporte@rollinggames.com</span></p>
      </div>
    )
  }
};

const UIModalContext = createContext();

export const UIModalProvider = ({ children }) => {
  const [modalActivo, setModalActivo] = useState(null);

  const abrirModal = useCallback((tipo) => setModalActivo(tipo), []);
  const cerrarModal = useCallback(() => setModalActivo(null), []);

  return (
    <UIModalContext.Provider value={{ modalActivo, abrirModal, cerrarModal, CONTENIDOS }}>
      {children}
    </UIModalContext.Provider>
  );
};

export const useUIModal = () => {
  const context = useContext(UIModalContext);
  if (!context) throw new Error("useUIModal debe ser utilizado dentro de un UIModalProvider");
  return context;
};

export default UIModalContext;
