import { useState } from "react";
import { Alert, Badge, Button, Container, Modal, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUIModal } from "../../context/UIModalContext.jsx";

const Menu = () => {
  const { usuarioActual, esAdmin, logout, wishlistIds } = useAuth();
  const { abrirModal } = useUIModal();
  const navigate = useNavigate();
  const [avisoIdioma, setAvisoIdioma] = useState(false);
  const [confirmarSalir, setConfirmarSalir] = useState(false);

  const ejecutarSalir = () => {
    setConfirmarSalir(false);
    logout();
    navigate("/");
  };

  const mostrarIdioma = () => {
    setAvisoIdioma(true);
    setTimeout(() => setAvisoIdioma(false), 3000);
  };

  return (
    <header className="sticky-top">
      <div className="epic-topbar d-none d-md-block">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            {["noticias", "distribucion", "ayuda"].map((t) => (
              <button key={t} className="epic-topbar-link bg-transparent border-0 text-capitalize" onClick={() => abrirModal(t)}>
                {t}
              </button>
            ))}
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              className="badge bg-secondary bg-opacity-25 text-light border-0 px-2 py-1 small"
              onClick={mostrarIdioma}
              title="Idioma predeterminado"
            >
              <i className="bi bi-globe2 me-1" />ES
            </button>
            <span className="text-secondary small">
              <i className="bi bi-shield-check text-primary me-1" />Rolling Gamer
            </span>
          </div>
        </Container>
      </div>

      {avisoIdioma && (
        <Alert variant="info" className="py-1 px-3 mb-0 text-center small rounded-0 border-0 bg-dark text-info">
          <i className="bi bi-info-circle me-1" />Plataforma en Español (Latinoamérica). Interfaz localizada predeterminada.
        </Alert>
      )}

      <Navbar expand="lg" variant="dark" className="epic-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <span className="epic-logo-badge">R</span>
            <span className="epic-heading h5 mb-0">ROLLING<span className="text-primary">GAMER</span></span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="nav" />

          <Navbar.Collapse id="nav">
            <Nav className="me-auto ms-lg-3">
              <Nav.Link as={NavLink} to="/" end className="epic-nav-link">
                <i className="bi bi-grid me-1" />Descubrir
              </Nav.Link>
              <Nav.Link as={NavLink} to="/wishlist" className="epic-nav-link">
                <i className="bi bi-heart me-1" />Deseos {usuarioActual && wishlistIds.length > 0 && <Badge bg="primary" pill>{wishlistIds.length}</Badge>}
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about" className="epic-nav-link">
                <i className="bi bi-people me-1" />Equipo
              </Nav.Link>
              {esAdmin && (
                <Nav.Link as={NavLink} to="/admin" className="epic-nav-link">
                  <i className="bi bi-speedometer2 me-1" />Admin
                </Nav.Link>
              )}
            </Nav>

            {usuarioActual ? (
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex flex-column text-end">
                  <span className="small text-light fw-bold">{usuarioActual.nombre}</span>
                  <span className="badge bg-secondary bg-opacity-50 text-uppercase py-0 px-1" style={{ fontSize: "0.65rem" }}>
                    {esAdmin ? "Administrador" : "Gamer"}
                  </span>
                </div>
                <Button size="sm" variant="outline-danger" onClick={() => setConfirmarSalir(true)} title="Cerrar sesión">
                  <i className="bi bi-box-arrow-right me-1" />Salir
                </Button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Button as={Link} to="/login" state={{ tab: "login" }} size="sm" className="btn-epic-primary">
                  <i className="bi bi-person me-1" />Ingresar
                </Button>
                <Button as={Link} to="/login" state={{ tab: "registro" }} size="sm" variant="outline-light">
                  Registro
                </Button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal de confirmación de cierre de sesión */}
      <Modal show={confirmarSalir} onHide={() => setConfirmarSalir(false)} centered size="sm" contentClassName="bg-dark text-light border-secondary">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="h6 mb-0">¿Cerrar sesión?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small text-secondary">
          Al confirmar saldrás de tu cuenta y regresarás al catálogo principal.
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button size="sm" variant="secondary" onClick={() => setConfirmarSalir(false)}>
            Cancelar
          </Button>
          <Button size="sm" variant="danger" onClick={ejecutarSalir}>
            Cerrar sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </header>
  );
};

export default Menu;
