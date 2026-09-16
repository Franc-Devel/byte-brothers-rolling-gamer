import { useState } from "react";
import { Alert, Badge, Button, Card, Col, Row } from "react-bootstrap";
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

  // Cálculos de Resumen
  const totalJuegos = juegos.length;
  const sumaPreciosOriginales = juegos.reduce((acc, j) => acc + (Number(j.precio) || 0), 0);
  const sumaPreciosFinales = juegos.reduce((acc, j) => acc + calcularPrecioFinal(j), 0);
  const ahorroTotal = sumaPreciosOriginales - sumaPreciosFinales;

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
    <div className="wishlist-page-container py-3 py-md-4 px-1 px-sm-0">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <h1 className="epic-heading h3 mb-0">Mi lista de deseos</h1>
        {totalJuegos > 0 && (
          <Badge bg="secondary" className="px-3 py-2 small">
            <i className="bi bi-heart-fill text-danger me-1" />{totalJuegos} {totalJuegos === 1 ? "guardado" : "guardados"}
          </Badge>
        )}
      </div>

      {aviso && (
        <Alert variant="info" className="py-2 small text-center mb-3">
          <i className="bi bi-info-circle me-1" />{aviso}
        </Alert>
      )}

      {/* Resumen de Selección en Pesos Argentinos */}
      {totalJuegos > 0 && (
        <Card className="epic-box p-3 mb-4 text-light shadow-sm">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="fw-semibold">Resumen de selección</span>
                <Badge bg="primary" pill>{totalJuegos} {totalJuegos === 1 ? "título" : "títulos"}</Badge>
              </div>
              <small className="text-secondary d-block">
                Lista de seguimiento personal. No opera como carrito de compras ni procesa pagos.
              </small>
            </div>
            <div className="text-md-end border-top border-md-0 border-secondary border-opacity-25 pt-2 pt-md-0">
              <span className="text-secondary small d-block">Inversión estimada total:</span>
              <span className="fs-4 fw-bold text-primary">{formatoMoneda(sumaPreciosFinales)}</span>
              {ahorroTotal > 0 && (
                <small className="text-success d-block">
                  <i className="bi bi-tag-fill me-1" />Ahorro en rebajas: {formatoMoneda(ahorroTotal)}
                </small>
              )}
            </div>
          </div>
        </Card>
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

      {juegos.length === 0 && (
        <Card className="epic-box p-5 text-center text-secondary border-dashed my-4 shadow-sm">
          <i className="bi bi-heartbreak display-4 text-secondary opacity-50 d-block mb-3" />
          <h2 className="epic-heading h4 text-light mb-2">Tu lista de deseos está vacía</h2>
          <p className="text-secondary small mb-4" style={{ maxWidth: 460, margin: "0 auto" }}>
            Explora el catálogo de Rolling Gamer y guarda tus títulos favoritos haciendo clic en el icono de corazón en cada juego.
          </p>
          <div>
            <Button as={Link} to="/" className="btn-epic-primary px-4 py-2">
              <i className="bi bi-grid me-2" />Explorar el catálogo
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Wishlist;
