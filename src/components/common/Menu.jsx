import { Badge, Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUIModal } from "../../context/UIModalContext.jsx";

const Menu = () => {
  const { usuarioActual, esAdmin, logout, wishlistIds } = useAuth();
  const { abrirModal } = useUIModal();
  const navigate = useNavigate();

  const salir = () => { logout(); navigate("/"); };

  return (
    <header className="sticky-top">
      <div className="epic-topbar d-none d-md-block">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2">
            {["noticias", "distribucion", "ayuda"].map((t) => (
              <button key={t} className="epic-topbar-link bg-transparent border-0 text-capitalize" onClick={() => abrirModal(t)}>
                {t}
              </button>
            ))}
          </div>
          <span className="text-secondary small">
            <i className="bi bi-shield-check text-primary me-1" />Rolling Gamer
          </span>
        </Container>
      </div>

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
                <span className="small text-secondary">{usuarioActual.nombre}</span>
                <Button size="sm" variant="outline-secondary" onClick={salir}>
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
    </header>
  );
};

export default Menu;
