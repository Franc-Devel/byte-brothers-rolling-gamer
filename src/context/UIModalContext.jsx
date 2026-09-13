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
  },
  terminos: {
    titulo: "Términos y Condiciones de Uso",
    cuerpo: (
      <div>
        <h6>1. Alcance del Servicio</h6>
        <p>Rolling Gamer es un prototipo académico de catálogo de videojuegos. Las compras y transacciones son puramente simuladas.</p>
        <h6>2. Cuentas de Usuario</h6>
        <p>El registro de usuarios almacena credenciales en el almacenamiento local del navegador (LocalStorage) para fines demostrativos.</p>
      </div>
    )
  },
  privacidad: {
    titulo: "Política de Privacidad",
    cuerpo: (
      <div>
        <p>Los datos ingresados durante el registro y las listas de deseos se conservan exclusivamente en tu navegador.</p>
        <p>No recopilamos datos bancarios reales ni transferimos información a servidores externos de terceros.</p>
      </div>
    )
  },
  reembolsos: {
    titulo: "Política de Reembolsos y Devoluciones",
    cuerpo: (
      <div>
        <p>Al tratarse de una tienda de demostración interactiva sin pasarela de cobro real, no se efectúan cargos monetarios.</p>
        <p>Podés agregar o eliminar cualquier título de tu lista de deseos de forma inmediata desde el catálogo.</p>
      </div>
    )
  },
  seguridad: {
    titulo: "Consejos de Seguridad para tu Cuenta",
    cuerpo: (
      <div>
        <p>• Utilizá contraseñas distintas a las de tus servicios bancarios o correos personales.</p>
        <p>• Cerrá sesión tras utilizar computadoras de uso compartido mediante el botón Cerrar Sesión del menú.</p>
        <p>• Las cuentas predeterminadas de evaluación (admin y user) están diseñadas para probar los roles del sistema.</p>
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
