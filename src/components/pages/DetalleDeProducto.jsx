import { Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProductos } from "../../context/ProductosContext.jsx";

const DetalleDeProducto = ({ buscarProducto, agregarResena }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productosCtx = useProductos();
  const { usuarioActual, isWishlisted, toggleWishlist } = useAuth();

  const buscar = buscarProducto || productosCtx?.buscarProducto;
  const agregar = agregarResena || productosCtx?.agregarResena;

  const juego = buscar ? buscar(id) : null;

  if (!juego) {
    return (
      <div className="text-center py-5">
        <div className="epic-box p-5 d-inline-block text-center shadow">
          <i className="bi bi-exclamation-triangle display-4 text-warning mb-3 d-block" />
          <h1 className="epic-heading h3 mb-2">Videojuego no encontrado</h1>
          <p className="text-secondary mb-4">
            El producto que intentas consultar no existe o fue retirado del catálogo.
          </p>
          <Button as={Link} to="/" className="btn-epic-primary">
            <i className="bi bi-arrow-left me-2" />Volver al catálogo principal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="detalle-producto-container py-3">
      <Link to="/" className="text-secondary text-decoration-none small d-inline-flex align-items-center mb-3">
        <i className="bi bi-arrow-left me-1" />Volver al catálogo
      </Link>
      <h1 className="epic-heading h2 text-light">{juego.nombre || juego.titulo}</h1>
    </div>
  );
};

export default DetalleDeProducto;
