import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUIModal } from "../../context/UIModalContext.jsx";
const Error404 = () => {
  const { abrirModal } = useUIModal();
  return (
    <Container className="py-5 text-center my-auto">
      <div className="epic-box p-4 p-md-5 mx-auto" style={{ maxWidth: "620px" }}>
        <div className="epic-logo-badge mb-3 mx-auto" style={{ width: "52px", height: "52px" }}>
          <i className="bi bi-exclamation-triangle-fill fs-3 text-dark" aria-hidden="true"></i>
        </div>
        <span className="epic-subheading d-block mb-2">ERROR 404 • ZONA NO ENCONTRADA</span>
        <h1 className="epic-heading fs-2 mb-3">
          Parece que te has perdido en el mapa
        </h1>
        <p className="text-secondary small mb-4">
          La ruta solicitada no existe en Rolling Gamer o fue reubicada.
          Podés regresar al catálogo principal, consultar las guías de ayuda o contactar al equipo.
        </p>
        <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 gap-sm-3">
          <Link to="/" className="btn-epic-primary">
            <i className="bi bi-house-door-fill me-1" aria-hidden="true"></i> Volver a la Tienda
          </Link>
          <button
            type="button"
            className="btn-epic-secondary"
            onClick={() => abrirModal("ayuda")}
            aria-label="Abrir centro de ayuda"
          >
            <i className="bi bi-question-circle-fill me-1" aria-hidden="true"></i> Centro de Ayuda
          </button>
          <Link to="/about" className="btn-epic-secondary">
            <i className="bi bi-people-fill me-1" aria-hidden="true"></i> Equipo
          </Link>
        </div>
      </div>
    </Container>
  );
};
export default Error404;
