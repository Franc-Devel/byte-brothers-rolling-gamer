import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProductos } from "../../context/ProductosContext.jsx";

const Wishlist = ({ juegos: juegosProp }) => {
  const { usuarioActual, getWishlistJuegos, toggleWishlist } = useAuth();
  const { productos } = useProductos();

  const listaDisponible = Array.isArray(juegosProp) && juegosProp.length > 0 ? juegosProp : (productos || []);
  const juegos = usuarioActual && getWishlistJuegos ? getWishlistJuegos(listaDisponible) : [];

  if (!usuarioActual) {
    return (
      <div className="epic-box p-5 text-center shadow">
        <i className="bi bi-person-lock display-4 text-primary mb-3 d-block" />
        <h1 className="epic-heading h3 mb-2">Inicia sesión para ver tus deseos</h1>
        <p className="text-secondary small mb-3">
          Tu lista de deseos está asociada a tu cuenta personal de Rolling Gamer.
        </p>
        <Button as={Link} to="/login" state={{ tab: "login" }} className="btn-epic-primary">
          <i className="bi bi-box-arrow-in-right me-1" />Ingresar a mi cuenta
        </Button>
      </div>
    );
  }
  return (
    <>
      <h1 className="epic-heading h3 mb-4">Mi lista de deseos</h1>
      <Row xs={1} md={2} lg={3} className="g-3">
        {juegos.map((j) => (
          <Col key={j.id}>
            <article className="epic-box p-3 h-100">
              <img src={j.imagen} alt={j.nombre} className="w-100 rounded mb-3 object-fit-cover" style={{ height: 170 }} />
              <h2 className="h5">{j.nombre}</h2>
              <p className="text-secondary small">{j.resumen}</p>
              <div className="d-flex gap-2">
                <Button as={Link} to={`/detalle/${j.id}`} size="sm" variant="primary">Detalle</Button>
                <Button size="sm" variant="outline-danger" onClick={() => toggleWishlist(j.id)}>Quitar</Button>
              </div>
            </article>
          </Col>
        ))}
      </Row>
      {juegos.length === 0 && <p className="epic-box p-4 text-center text-secondary">Todavia no guardaste juegos.</p>}
    </>
  );
};

export default Wishlist;
