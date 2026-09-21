import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "./AuthContext.jsx";
const CONTENIDOS = {
  noticias: {
    titulo: "Noticias y Actualizaciones",
    cuerpo: (
      <div>
        <h6 className="text-info">🔥 Lanzamientos de Temporada</h6>
        <p>Se incorporaron títulos AAA al catálogo digital con especificaciones técnicas y galería de capturas.</p>
        <h6 className="text-info">🛠️ Parche y Optimización v1.2</h6>
        <p>Mejoras de rendimiento en el filtrado por categorías y sincronización fluida de deseos en LocalStorage.</p>
        <p className="text-muted small">Nota: Plataforma académica demostrativa desarrollada con fines educativos.</p>
      </div>
    )
  },
  ayuda: {
    titulo: "Centro de Ayuda y Preguntas Frecuentes",
    cuerpo: (
      <div>
        <p><strong>¿Cómo guardar un juego en mi lista de deseos?</strong><br />Iniciá sesión y presioná el botón de marcador en cualquier tarjeta de juego.</p>
        <p><strong>¿Cómo publicar una reseña?</strong><br />Accedé a la ficha de detalle de cualquier título con tu cuenta abierta y dejá tu voto.</p>
        <p><strong>¿Necesitás asistencia técnica?</strong><br />Escribinos a: <span className="text-info">soporte@rollinggames.com</span></p>
      </div>
    )
  },
  distribucion: {
    titulo: "Distribución y Publicación de Videojuegos",
    esDistribucion: true
  },
  terminos: {
    titulo: "Términos y Condiciones de Uso",
    cuerpo: (
      <div>
        <h6>1. Alcance del Servicio</h6>
        <p>Rolling Gamer es un prototipo académico de catálogo de videojuegos. Las transacciones son simuladas.</p>
        <h6>2. Cuentas de Usuario</h6>
        <p>El registro almacena credenciales en el almacenamiento local (LocalStorage) con fines de evaluación.</p>
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
        <p>Al tratarse de una tienda interactiva sin pasarela de cobro real, no se efectúan cargos monetarios.</p>
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
  const navigate = useNavigate();
  const { esAdmin, usuario, logout, loginRapido } = useAuth();
  const abrirModal = useCallback((tipo) => setModalActivo(tipo), []);
  const cerrarModal = useCallback(() => setModalActivo(null), []);
  const manejarDistribucion = useCallback(() => {
    cerrarModal();
    if (esAdmin) {
      navigate("/crear");
    } else if (usuario) {
      loginRapido("admin");
      navigate("/crear");
    } else {
      navigate("/login", { state: { tab: "login", from: { pathname: "/crear" } } });
    }
  }, [cerrarModal, navigate, esAdmin, usuario, loginRapido]);
  useEffect(() => {
    const alPresionarTecla = (e) => { if (e.key === "Escape" && modalActivo) cerrarModal(); };
    window.addEventListener("keydown", alPresionarTecla);
    return () => window.removeEventListener("keydown", alPresionarTecla);
  }, [modalActivo, cerrarModal]);
  const actual = modalActivo ? CONTENIDOS[modalActivo] : null;
  const renderCuerpo = () => {
    if (!actual) return null;
    if (!actual.esDistribucion) return actual.cuerpo;
    if (esAdmin) {
      return (
        <div>
          <div className="d-flex align-items-center gap-2 mb-3 text-success">
            <i className="bi bi-shield-check fs-4" />
            <h6 className="mb-0 fw-bold">Cuenta de Administrador Habilitada</h6>
          </div>
          <p>
            ¡Hola, <strong>{usuario?.nombre || "Administrador"}</strong>! Tu cuenta cuenta con permisos oficiales para gestionar el catálogo y publicar nuevos videojuegos en la plataforma.
          </p>
          <p className="text-secondary small mb-0">
            Al presionar <strong>"Publicar Videojuego"</strong> serás redirigido al formulario de alta en <code>/crear</code>.
          </p>
        </div>
      );
    }
    if (usuario) {
      return (
        <div>
          <div className="d-flex align-items-center gap-2 mb-3 text-warning">
            <i className="bi bi-person-badge fs-4" />
            <h6 className="mb-0 fw-bold">Sesión activa como Usuario Gamer</h6>
          </div>
          <p>
            Actualmente estás conectado como <strong>{usuario.nombre}</strong> (rol: <em>Usuario Gamer</em>).
          </p>
          <div className="p-3 mb-3 rounded bg-black bg-opacity-50 border border-warning border-opacity-25 small">
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-info-circle text-warning mt-1" />
              <div>
                La publicación directa de videojuegos al catálogo de la tienda está restringida exclusivamente a cuentas con rol de <strong>Administrador</strong>.
                <br />
                Como usuario gamer tenés habilitadas las funciones de compra simulada, lista de deseos y redacción de reseñas comunitarias.
              </div>
            </div>
          </div>
          <p className="text-secondary small mb-0">
            Para publicar un videojuego durante la evaluación podés ingresar directamente como Administrador con el botón inferior.
          </p>
        </div>
      );
    }
    return (
      <div>
        <div className="d-flex align-items-center gap-2 mb-3 text-info">
          <i className="bi bi-cloud-arrow-up fs-4" />
          <h6 className="mb-0 fw-bold">Distribución y Publicación de Videojuegos</h6>
        </div>
        <p>
          Publicá tus producciones independientes o títulos destacados en el catálogo oficial de Rolling Gamer.
        </p>
        <p className="text-secondary small mb-0">
          Para publicar títulos en el catálogo se requiere iniciar sesión con una cuenta de <strong>Administrador</strong>.
        </p>
      </div>
    );
  };
  const renderBotonesDistribucion = () => {
    if (esAdmin) {
      return (
        <Button variant="primary" className="btn-epic-primary" onClick={manejarDistribucion}>
          <i className="bi bi-plus-circle me-1" />
          Publicar Videojuego
        </Button>
      );
    }
    if (usuario) {
      return (
        <>
          <Button
            variant="outline-secondary"
            className="btn-epic-secondary text-light"
            onClick={() => {
              cerrarModal();
              logout();
              navigate("/login", { state: { tab: "login", from: { pathname: "/crear" } } });
            }}
          >
            <i className="bi bi-box-arrow-right me-1" />
            Cambiar Cuenta
          </Button>
          <Button
            variant="warning"
            className="btn-epic-primary bg-warning text-dark border-0 fw-semibold"
            onClick={manejarDistribucion}
          >
            <i className="bi bi-shield-lock me-1" />
            Ingresar como Admin y Publicar
          </Button>
        </>
      );
    }
    return (
      <Button variant="primary" className="btn-epic-primary" onClick={manejarDistribucion}>
        <i className="bi bi-box-arrow-in-right me-1" />
        Iniciar Sesión como Admin
      </Button>
    );
  };
  return (
    <UIModalContext.Provider value={{ modalActivo, abrirModal, cerrarModal, manejarDistribucion, CONTENIDOS }}>
      {children}
      {actual && (
        <Modal show={Boolean(modalActivo)} onHide={cerrarModal} centered scrollable contentClassName="bg-dark text-light border-secondary">
          <Modal.Header closeButton closeVariant="white" className="border-secondary">
            <Modal.Title className="fs-5">{actual.titulo}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-3" style={{ maxHeight: "65vh" }}>
            {renderCuerpo()}
          </Modal.Body>
          <Modal.Footer className="border-secondary">
            {actual.esDistribucion && renderBotonesDistribucion()}
            <Button variant="secondary" className="btn-epic-secondary" onClick={cerrarModal}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
      )}
    </UIModalContext.Provider>
  );
};
export const useUIModal = () => {
  const context = useContext(UIModalContext);
  if (!context) throw new Error("useUIModal debe ser utilizado dentro de un UIModalProvider");
  return context;
};
export default UIModalContext;
