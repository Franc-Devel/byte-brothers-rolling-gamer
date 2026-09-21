import { useState } from "react";
import { Alert, Badge, Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProductos } from "../../context/ProductosContext.jsx";

const FALLBACK_IMG = "/images/games/07-counter-strike-2/header.jpg";

const formatoMoneda = (val) => `$${Number(val || 0).toLocaleString("es-AR")} ARS`;

const specs = (r = {}) => [
  ["SO", r.so || "Windows 10 64-bit"],
  ["CPU", r.cpu || r.procesador || "Intel Core i5 / AMD Ryzen 3"],
  ["RAM", r.ram || r.memoria || "8 GB RAM"],
  ["GPU", r.gpu || r.graficos || "GeForce GTX 960 / Radeon RX 470"],
  ["Almacenamiento", r.almacenamiento || r.disco || "50 GB de espacio disponible"],
];

const crearPayloadResena = ({ usuario, texto, esPositiva }) => ({
  id: `resena-${Date.now()}`,
  autor: usuario?.nombre || "Gamer",
  usuario: usuario?.nombre || "Gamer",
  fecha: new Date().toISOString().split("T")[0],
  voto: esPositiva ? "positivo" : "negativo",
  esPositiva,
  comentario: texto,
});

const DetalleDeProducto = ({ buscarProducto, agregarResena }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productosCtx = useProductos();
  const { usuarioActual, isWishlisted, toggleWishlist } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCompraModal, setShowCompraModal] = useState(false);
  const [compraExitosa, setCompraExitosa] = useState(false);

  // Formulario de Reseñas
  const [comentario, setComentario] = useState("");
  const [votoPositivo, setVotoPositivo] = useState(true);
  const [alertaResena, setAlertaResena] = useState(null);

  // Galería interactiva (declarada incondicionalmente antes de cualquier retorno)
  const [imgSeleccionada, setImgSeleccionada] = useState(null);

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
  const descripcionCorta = juego.resumen || juego.descripcionCorta || "Sin sinopsis disponible.";
  const descripcionLarga = juego.descripcion || juego.descripcionDetallada || descripcionCorta;

  // Lógica de Galería interactiva sin duplicados
  const portada = juego.portada || juego.imagen || FALLBACK_IMG;
  const imagenesGaleria = Array.from(
    new Set([portada, ...(Array.isArray(juego.galeria) ? juego.galeria : [])].filter(Boolean))
  );
  const imgActiva = imgSeleccionada || portada;

  // Lógica de Precios coherente con CardJuego e Inicio
  const precioOriginal = Number(juego.precio) || 0;
  const descuento = Number(juego.descuento) || 0;
  const tieneDescuento = descuento > 0;
  const precioCalculado = tieneDescuento
    ? Math.round(precioOriginal * (1 - descuento / 100))
    : precioOriginal;

  // Control de Lista de Deseos
  const deseado = isWishlisted ? isWishlisted(juego.id) : false;
  const handleDeseos = () => {
    if (!usuarioActual) {
      setShowAuthModal(true);
      return;
    }
    toggleWishlist?.(juego.id);
  };

  // Manejo y Estadísticas de Reseñas
  const resenas = Array.isArray(juego.resenas) ? juego.resenas : [];
  const esPositiva = (r) => r.esPositiva ?? r.voto === "positivo";
  const totalResenas = resenas.length;
  const positivas = resenas.filter(esPositiva).length;
  const porcentajeAprobacion = totalResenas > 0 ? Math.round((positivas / totalResenas) * 100) : null;
  const metricasResenas = {
    texto: porcentajeAprobacion !== null ? `${porcentajeAprobacion}%` : "Sin opiniones",
    detalle: porcentajeAprobacion !== null ? `${porcentajeAprobacion}% positivas (${totalResenas})` : "Aún sin reseñas",
    clasificacion: porcentajeAprobacion === null ? "Pendiente" : porcentajeAprobacion >= 70 ? "Mayormente positivas" : porcentajeAprobacion >= 40 ? "Mixtas" : "Mayormente negativas",
    variant: porcentajeAprobacion === null ? "secondary" : porcentajeAprobacion >= 70 ? "success" : porcentajeAprobacion >= 40 ? "warning" : "danger",
  };

  const handleEnviarResena = (e) => {
    e.preventDefault();
    setAlertaResena(null);
    if (!usuarioActual) {
      setAlertaResena({ variant: "warning", texto: "Debes iniciar sesión para publicar una reseña." });
      return;
    }
    const texto = comentario.trim();
    if (texto.length < 5) {
      setAlertaResena({ variant: "warning", texto: "La opinión debe contener al menos 5 caracteres." });
      return;
    }
    const nueva = crearPayloadResena({
      usuario: usuarioActual,
      texto,
      esPositiva: votoPositivo,
    });
    agregar?.(juego.id, nueva);
    setComentario("");
    setAlertaResena({ variant: "success", texto: "¡Tu reseña ha sido publicada y agregada a las estadísticas!" });
    setTimeout(() => setAlertaResena(null), 3500);
  };

  return (
    <div className="detalle-producto-container py-3 py-md-4 px-1 px-sm-0">
      <Link
        to="/"
        className="text-secondary text-decoration-none small d-inline-flex align-items-center mb-3"
        title="Regresar al catálogo principal"
      >
        <i className="bi bi-arrow-left me-1" />Volver al catálogo
      </Link>

      <Row className="g-4">
        {/* Columna Multimedia Principal con Galería */}
        <Col lg={7} xl={8}>
          <div className="epic-box p-2 text-center shadow">
            <img
              src={imgActiva}
              alt={titulo}
              className="w-100 rounded object-fit-cover shadow"
              style={{ maxHeight: 440, minHeight: 280 }}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMG;
              }}
            />
          </div>

          {/* Miniaturas de la Galería */}
          {imagenesGaleria.length > 1 && (
            <div className="d-flex gap-2 mt-3 overflow-x-auto pb-2" role="region" aria-label="Galería de imágenes">
              {imagenesGaleria.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setImgSeleccionada(img)}
                  aria-label={`Mostrar imagen ${idx + 1} de ${imagenesGaleria.length}`}
                  className={`btn p-0 border rounded overflow-hidden flex-shrink-0 transition-all ${
                    imgActiva === img ? "border-primary shadow" : "border-secondary border-opacity-50 opacity-75"
                  }`}
                  style={{ width: 100, height: 60 }}
                  title={`Ver imagen ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
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

              <h1 className="epic-heading h3 text-light mb-2">{titulo}</h1>
              <p className="text-secondary small mb-3">{descripcionCorta}</p>

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
                <div className="d-flex justify-content-between align-items-center py-1">
                  <span>Reseñas:</span>
                  <Badge bg={metricasResenas.variant} className="small">
                    {metricasResenas.texto} {totalResenas > 0 && `(${totalResenas})`}
                  </Badge>
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

              {/* Acciones principales */}
              <div className="d-grid gap-2">
                <Button
                  className="btn-epic-primary py-2 fw-semibold"
                  onClick={() => {
                    setCompraExitosa(false);
                    setShowCompraModal(true);
                  }}
                >
                  <i className="bi bi-bag-check me-2" />Comprar ahora
                </Button>
                <Button
                  variant={deseado ? "outline-danger" : "outline-light"}
                  className="py-2 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleDeseos}
                >
                  <i className={`bi ${deseado ? "bi-heart-fill text-danger" : "bi-heart"}`} />
                  <span>{deseado ? "En tu lista de deseos" : "Añadir a lista de deseos"}</span>
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Sección Descripción General Extensa */}
      <Row className="mt-4">
        <Col lg={8}>
          <Card className="epic-box p-4 text-light shadow-sm">
            <h2 className="epic-heading h5 mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              <i className="bi bi-card-text me-2 text-primary" />Acerca de este juego
            </h2>
            <p className="text-secondary lh-lg mb-0" style={{ whiteSpace: "pre-line" }}>
              {descripcionLarga}
            </p>
          </Card>
        </Col>
      </Row>

      {/* Sección Requisitos de Sistema */}
      <Row className="g-3 my-4">
        {["minimos", "recomendados"].map((tipo) => (
          <Col md={6} key={tipo}>
            <Card className="epic-specs-col h-100 text-light p-3 shadow-sm">
              <h3 className="epic-specs-title text-capitalize h6 mb-3 text-primary">
                Requisitos {tipo}
              </h3>
              <ul className="list-unstyled small text-secondary mb-0 d-flex flex-column gap-2">
                {specs(juego.requisitos?.[tipo]).map(([k, v]) => (
                  <li key={k} className="border-bottom border-secondary border-opacity-25 pb-1">
                    <strong className="text-light">{k}:</strong> {v}
                  </li>
                ))}
              </ul>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Sección Reseñas Comunitarias */}
      <section className="mt-5">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h2 className="epic-heading h4 mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-chat-square-quote text-primary" />
            <span>Reseñas de la comunidad</span>
          </h2>
          <Badge bg={metricasResenas.variant} className="small py-2 px-3">
            {metricasResenas.detalle} {totalResenas > 0 && `• ${metricasResenas.clasificacion}`}
          </Badge>
        </div>

        <Row className="g-4">
          {/* Listado de Opiniones */}
          <Col lg={7}>
            {resenas.length === 0 ? (
              <Card className="epic-box p-4 text-center text-secondary border-dashed">
                <i className="bi bi-chat-dots display-6 d-block mb-2 text-muted" />
                <p className="mb-0">Aún no hay opiniones sobre este videojuego. ¡Sé el primero en compartir tu experiencia!</p>
              </Card>
            ) : (
              <div className="d-flex flex-column gap-3">
                {resenas.map((r, i) => {
                  const pos = esPositiva(r);
                  const autor = r.autor || r.usuario || "Gamer";
                  return (
                    <Card key={r.id || `resena-${i}`} className="epic-box p-3 text-light shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-secondary rounded-circle p-2 text-uppercase">
                            {autor.slice(0, 2)}
                          </span>
                          <div>
                            <strong className="d-block small">{autor}</strong>
                            <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
                              {r.fecha || "Reciente"}
                            </span>
                          </div>
                        </div>
                        <Badge bg={pos ? "success" : "danger"} className="d-inline-flex align-items-center gap-1">
                          <i className={`bi ${pos ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-down-fill"}`} />
                          <span>{pos ? "Recomendado" : "No recomendado"}</span>
                        </Badge>
                      </div>
                      <p className="text-secondary small mb-0 lh-base">{r.comentario}</p>
                    </Card>
                  );
                })}
              </div>
            )}
          </Col>

          {/* Formulario de Publicación Protegido */}
          <Col lg={5}>
            <Card className="epic-box p-4 text-light shadow-sm sticky-lg-top" style={{ top: "90px" }}>
              <h3 className="epic-heading h5 mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-pencil-square text-primary" />
                <span>Publicar opinión</span>
              </h3>

              {alertaResena && (
                <Alert variant={alertaResena.variant} className="py-2 small">
                  {alertaResena.texto}
                </Alert>
              )}

              {usuarioActual ? (
                <Form onSubmit={handleEnviarResena}>
                  <div className="mb-3">
                    <Form.Label className="small text-secondary fw-semibold d-block mb-2">
                      ¿Recomiendas este juego?
                    </Form.Label>
                    <div className="d-flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={votoPositivo ? "success" : "outline-secondary"}
                        className="w-50 d-flex align-items-center justify-content-center gap-1"
                        onClick={() => setVotoPositivo(true)}
                      >
                        <i className="bi bi-hand-thumbs-up-fill" />
                        <span>Sí, lo recomiendo</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={!votoPositivo ? "danger" : "outline-secondary"}
                        className="w-50 d-flex align-items-center justify-content-center gap-1"
                        onClick={() => setVotoPositivo(false)}
                      >
                        <i className="bi bi-hand-thumbs-down-fill" />
                        <span>No lo recomiendo</span>
                      </Button>
                    </div>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label className="small text-secondary fw-semibold">
                      Tu comentario (mínimo 5 caracteres)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      className="epic-input"
                      placeholder="Cuéntale a la comunidad tu experiencia jugando este título..."
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      required
                      minLength={5}
                    />
                    <div className="text-end mt-1">
                      <small className={`small ${comentario.trim().length >= 5 ? "text-secondary" : "text-muted"}`}>
                        {comentario.trim().length} / 5 mín.
                      </small>
                    </div>
                  </Form.Group>

                  <Button type="submit" className="btn-epic-primary w-100 py-2">
                    <i className="bi bi-send me-1" />Publicar reseña
                  </Button>
                </Form>
              ) : (
                <div className="text-center py-3">
                  <i className="bi bi-person-lock display-6 text-secondary d-block mb-2" />
                  <p className="small text-secondary mb-3">
                    Inicia sesión con tu cuenta de Rolling Gamer para calificar este juego y dejar tu opinión.
                  </p>
                  <Button
                    as={Link}
                    to="/login"
                    state={{ tab: "login" }}
                    size="sm"
                    className="btn-epic-primary w-100"
                  >
                    <i className="bi bi-box-arrow-in-right me-1" />Iniciar sesión
                  </Button>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </section>
      {/* Modal de Autenticación Requerida para Deseos */}
      <Modal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        centered
        size="sm"
        contentClassName="bg-dark text-light border-secondary shadow"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="h6 mb-0">
            <i className="bi bi-heart text-danger me-2" />Lista de Deseos
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="small text-secondary">
          Debes iniciar sesión con tu cuenta para guardar <strong>{titulo}</strong> en tu lista personalizada de deseos.
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button size="sm" variant="secondary" onClick={() => setShowAuthModal(false)}>
            Cancelar
          </Button>
          <Button
            size="sm"
            className="btn-epic-primary"
            onClick={() => {
              setShowAuthModal(false);
              navigate("/login", { state: { tab: "login" } });
            }}
          >
            Iniciar sesión
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Compra Simulada */}
      <Modal
        show={showCompraModal}
        onHide={() => setShowCompraModal(false)}
        centered
        contentClassName="bg-dark text-light border-secondary shadow"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="h6 mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-cart-check text-primary" />
            <span>Confirmar adquisición</span>
            <Badge bg="secondary" className="small">Simulación</Badge>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="small">
          <div className="d-flex align-items-center gap-3 p-2 rounded bg-black bg-opacity-50 mb-3 border border-secondary border-opacity-25">
            <img
              src={portada}
              alt={titulo}
              className="rounded object-fit-cover"
              style={{ width: 64, height: 40 }}
              onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
            />
            <div>
              <strong className="d-block text-light text-truncate" style={{ maxWidth: 260 }}>{titulo}</strong>
              <span className="text-primary fw-bold">{formatoMoneda(precioCalculado)}</span>
            </div>
          </div>

          {compraExitosa ? (
            <Alert variant="success" className="py-2 mb-0 text-center">
              <i className="bi bi-check-circle-fill me-2" />
              ¡Compra simulada registrada con éxito! Gracias por probar la plataforma.
            </Alert>
          ) : (
            <Alert variant="info" className="py-2 mb-0 small text-secondary">
              <i className="bi bi-info-circle me-1 text-info" />
              Esta es una simulación de compra con fines educativos. No se realizarán cargos monetarios ni se añade a una biblioteca de descargas.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          {compraExitosa ? (
            <Button size="sm" className="btn-epic-primary w-100" onClick={() => setShowCompraModal(false)}>
              Entendido / Cerrar
            </Button>
          ) : (
            <>
              <Button size="sm" variant="secondary" onClick={() => setShowCompraModal(false)}>
                Cancelar
              </Button>
              <Button size="sm" className="btn-epic-primary" onClick={() => setCompraExitosa(true)}>
                Confirmar compra simulada
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetalleDeProducto;
