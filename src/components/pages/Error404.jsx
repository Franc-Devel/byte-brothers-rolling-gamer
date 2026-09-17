import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <Container className="py-5 text-center my-auto">
      <div className="epic-box p-4 p-md-5 mx-auto" style={{ maxWidth: "600px" }}>
        <div className="epic-logo-badge mb-3 mx-auto" style={{ width: "52px", height: "52px" }}>
          <i className="bi bi-exclamation-triangle-fill fs-3 text-dark" aria-hidden="true"></i>
        </div>

        <span className="epic-subheading d-block mb-2">ERROR 404 • ZONA NO ENCONTRADA</span>

        <h1 className="epic-heading fs-2 mb-3">
          Parece que te has perdido en el mapa
        </h1>

        <p className="text-secondary small mb-4">
          La ruta que intentas explorar no existe o fue retirada del catálogo de Rolling Gamer.
          Comprueba el enlace ingresado o retoma la navegación por la tienda.
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Link to="/" className="btn-epic-primary">
            <i className="bi bi-house-door-fill me-1" aria-hidden="true"></i> Volver a la Tienda
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Error404;
