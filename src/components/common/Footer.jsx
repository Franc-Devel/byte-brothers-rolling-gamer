import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUIModal } from "../../context/UIModalContext.jsx";

const Footer = () => {
  const { esAdmin } = useAuth();
  const { abrirModal } = useUIModal();

  const volverArriba = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="epic-footer pt-5 pb-4 mt-auto">
      <Container>
        {/* Redes sociales externas y retorno al inicio */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-3 fs-5">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-secondary text-decoration-none" aria-label="Facebook de Rolling Gamer">
              <i className="bi bi-facebook" aria-hidden="true"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-secondary text-decoration-none" aria-label="Twitter X de Rolling Gamer">
              <i className="bi bi-twitter-x" aria-hidden="true"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-secondary text-decoration-none" aria-label="YouTube de Rolling Gamer">
              <i className="bi bi-youtube" aria-hidden="true"></i>
            </a>
          </div>

          <button onClick={volverArriba} className="btn btn-link text-secondary small text-decoration-none p-0 border-0" aria-label="Desplazar suavemente al inicio de la página">
            <i className="bi bi-chevron-up me-1" aria-hidden="true"></i> Volver arriba
          </button>
        </div>

        {/* Columnas de navegación interna, recursos y legales */}
        <Row className="gy-4 mb-4 small">
          <Col xs={12} sm={6} md={3}>
            <span className="epic-subheading d-block mb-3">Navegación</span>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary mb-0">
              <li><Link to="/" className="text-secondary text-decoration-none">Tienda y Catálogo</Link></li>
              <li><Link to="/about" className="text-secondary text-decoration-none">Equipo de Desarrollo</Link></li>
              <li><Link to="/wishlist" className="text-secondary text-decoration-none">Lista de Deseos</Link></li>
              {esAdmin && <li><Link to="/admin" className="text-secondary text-decoration-none">Panel de Administración</Link></li>}
            </ul>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <span className="epic-subheading d-block mb-3">Recursos y Soporte</span>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary mb-0">
              <li><button type="button" className="btn btn-link p-0 text-secondary text-decoration-none small text-start border-0" onClick={() => abrirModal("ayuda")}>Centro de Ayuda</button></li>
              <li><button type="button" className="btn btn-link p-0 text-secondary text-decoration-none small text-start border-0" onClick={() => abrirModal("noticias")}>Noticias de Temporada</button></li>
              <li><button type="button" className="btn btn-link p-0 text-secondary text-decoration-none small text-start border-0" onClick={() => abrirModal("distribucion")}>Publicar Videojuegos</button></li>
            </ul>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <span className="epic-subheading d-block mb-3">Términos y Políticas</span>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary mb-0">
              <li><button type="button" className="btn btn-link p-0 text-secondary text-decoration-none small text-start border-0" onClick={() => abrirModal("terminos")}>Términos del Servicio</button></li>
              <li><button type="button" className="btn btn-link p-0 text-secondary text-decoration-none small text-start border-0" onClick={() => abrirModal("privacidad")}>Política de Privacidad</button></li>
              <li><button type="button" className="btn btn-link p-0 text-secondary text-decoration-none small text-start border-0" onClick={() => abrirModal("reembolsos")}>Política de Reembolsos</button></li>
              <li><button type="button" className="btn btn-link p-0 text-secondary text-decoration-none small text-start border-0" onClick={() => abrirModal("seguridad")}>Consejos de Seguridad</button></li>
            </ul>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <span className="epic-subheading d-block mb-3">Rolling Gamer</span>
            <p className="text-secondary mb-2">
              Plataforma interactiva de videojuegos desarrollada con fines educativos para RollingCode School.
            </p>
            <span className="text-muted small">Stack: React 19, React Router, Bootstrap 5.</span>
          </Col>
        </Row>

        <hr className="border-secondary border-opacity-25 my-4" />

        {/* Derechos de autor y accesos rápidos legales */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-secondary">
          <div>
            &copy; {new Date().getFullYear()} Rolling Gamer. Proyecto educativo de RollingCode School.
          </div>
          <div className="d-flex gap-3 text-nowrap">
            <button type="button" className="btn btn-link p-0 text-secondary text-decoration-none small border-0" onClick={() => abrirModal("privacidad")}>Privacidad</button>
            <span>•</span>
            <button type="button" className="btn btn-link p-0 text-secondary text-decoration-none small border-0" onClick={() => abrirModal("terminos")}>Condiciones</button>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
