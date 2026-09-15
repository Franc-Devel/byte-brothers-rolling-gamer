import { Badge, Button, Col, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProductos } from "../../context/ProductosContext.jsx";

const formatoMoneda = (val) => `$${Number(val || 0).toLocaleString("es-AR")} ARS`;

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

  const titulo = juego.nombre || juego.titulo || "Videojuego sin título";
  const genero = juego.genero || juego.categoria || "General";
  const estudio = juego.estudio || juego.desarrollador || "Estudio no especificado";
  const editor = juego.editor || juego.desarrollador || "Rolling Gamer Distribution";
  const lanzamiento = juego.lanzamiento || "Próximamente";
  const plataforma = juego.plataforma || "PC / Windows";

  // Lógica de Precios coherente con CardJuego e Inicio
  const precioOriginal = Number(juego.precio) || 0;
  const descuento = Number(juego.descuento) || 0;
  const tieneDescuento = descuento > 0;
  const precioCalculado = tieneDescuento
    ? Math.round(precioOriginal * (1 - descuento / 100))
    : precioOriginal;

  return (
    <div className="detalle-producto-container py-3">
      <Link to="/" className="text-secondary text-decoration-none small d-inline-flex align-items-center mb-3">
        <i className="bi bi-arrow-left me-1" />Volver al catálogo
      </Link>

      <Row className="g-4">
        {/* Columna Multimedia Principal */}
        <Col lg={7} xl={8}>
          <div className="epic-box p-2 text-center">
            <img
              src={juego.imagen || juego.portada}
              alt={titulo}
              className="w-100 rounded object-fit-cover shadow"
              style={{ maxHeight: 440 }}
            />
          </div>
        </Col>

        {/* Columna Información Lateral */}
        <Col lg={5} xl={4}>
          <div className="epic-box p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <Badge bg="primary" className="text-uppercase px-2 py-1">
                  {genero}
                </Badge>
                <Badge bg="dark" className="border border-secondary text-secondary">
                  <i className="bi bi-display me-1" />{plataforma}
                </Badge>
              </div>

              <h1 className="epic-heading h3 text-light mb-3">{titulo}</h1>

              <div className="small text-secondary border-top border-secondary border-opacity-25 pt-3 mb-3">
                <div className="d-flex justify-content-between py-1">
                  <span>Desarrollador:</span>
                  <span className="text-light fw-semibold">{estudio}</span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span>Editor:</span>
                  <span className="text-light fw-semibold">{editor}</span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span>Lanzamiento:</span>
                  <span className="text-light fw-semibold">{lanzamiento}</span>
                </div>
              </div>
            </div>

            {/* Bloque de Precios y Oferta */}
            <div className="border-top border-secondary border-opacity-25 pt-3">
              <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                {tieneDescuento && (
                  <Badge bg="success" className="fs-6 px-2 py-1">
                    -{descuento}%
                  </Badge>
                )}
                {tieneDescuento && (
                  <span className="text-muted text-decoration-line-through small">
                    {formatoMoneda(precioOriginal)}
                  </span>
                )}
              </div>
              <div className="fs-3 fw-bold text-light mb-3">
                {formatoMoneda(precioCalculado)}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DetalleDeProducto;
