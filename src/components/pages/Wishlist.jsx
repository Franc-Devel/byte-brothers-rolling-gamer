import { useState } from "react";
import { Alert, Badge, Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProductos } from "../../context/ProductosContext.jsx";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80";

const formatoMoneda = (val) => `$${Number(val || 0).toLocaleString("es-AR")} ARS`;

const calcularPrecioFinal = (p) => {
  const desc = Number(p.descuento) || 0;
  const prec = Number(p.precio) || 0;
  return desc > 0 ? Math.round(prec * (1 - desc / 100)) : prec;
};

const Wishlist = ({ juegos: juegosProp }) => {
  const { usuarioActual, getWishlistJuegos, toggleWishlist } = useAuth();
  const { productos } = useProductos();
  const [aviso, setAviso] = useState(null);

  const listaDisponible = Array.isArray(juegosProp) && juegosProp.length > 0 ? juegosProp : (productos || []);
  const juegos = usuarioActual && getWishlistJuegos ? getWishlistJuegos(listaDisponible) : [];

  const handleQuitar = (juego) => {
    const nombre = juego.nombre || juego.titulo || "Videojuego";
    toggleWishlist?.(juego.id);
    setAviso(`"${nombre}" fue eliminado de tu lista de deseos.`);
    setTimeout(() => setAviso(null), 3500);
  };

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
      {aviso && (
        <Alert variant="info" className="py-2 small text-center mb-3">
          <i className="bi bi-info-circle me-1" />{aviso}
        </Alert>
      )}
      <Row xs={1} md={2} lg={3} className="g-3">
        {juegos.map((j) => {
          const precioOriginal = Number(j.precio) || 0;
          const descuento = Number(j.descuento) || 0;
          const precioFinal = calcularPrecioFinal(j);
          const tieneDescuento = descuento > 0;

          return (
            <Col key={j.id}>
              <article className="epic-box p-3 h-100 d-flex flex-column justify-content-between shadow-sm">
                <div>
                  <div className="position-relative mb-3">
                    <img
                      src={j.imagen || j.portada || FALLBACK_IMG}
                      alt={j.nombre || j.titulo}
                      className="w-100 rounded object-fit-cover shadow"
                      style={{ height: 180 }}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                    />
                    {tieneDescuento && (
                      <Badge bg="success" className="position-absolute top-0 start-0 m-2">
                        -{descuento}%
                      </Badge>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Badge bg="primary" className="text-uppercase" style={{ fontSize: "0.72rem" }}>
                      {j.genero || j.categoria || "Juego"}
                    </Badge>
                    <small className="text-secondary text-truncate" style={{ maxWidth: 160 }}>
                      {j.desarrollador || j.estudio || "Estudio"}
                    </small>
                  </div>

                  <h2 className="h5 text-light text-truncate mb-1">{j.nombre || j.titulo}</h2>
                  <p className="text-secondary small line-clamp-2 mb-3">
                    {j.resumen || j.descripcionCorta || "Sin descripción disponible."}
                  </p>
                </div>

                <div className="border-top border-secondary border-opacity-25 pt-3 mt-auto">
                  <div className="d-flex align-items-baseline gap-2 mb-3">
                    <span className="fs-5 fw-bold text-light">{formatoMoneda(precioFinal)}</span>
                    {tieneDescuento && (
                      <span className="text-muted small text-decoration-line-through">
                        {formatoMoneda(precioOriginal)}
                      </span>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <Button as={Link} to={`/detalle/${j.id}`} size="sm" className="btn-epic-primary w-50">
                      <i className="bi bi-eye me-1" />Detalle
                    </Button>
                    <Button size="sm" variant="outline-danger" className="w-50" onClick={() => handleQuitar(j)}>
                      <i className="bi bi-trash me-1" />Quitar
                    </Button>
                  </div>
                </div>
              </article>
            </Col>
          );
        })}
      </Row>
      {juegos.length === 0 && <p className="epic-box p-4 text-center text-secondary">Todavia no guardaste juegos.</p>}
    </>
  );
};

export default Wishlist;
