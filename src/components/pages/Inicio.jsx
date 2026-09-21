import { useMemo, useState } from "react";
import { Badge, Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProductos } from "../../context/ProductosContext.jsx";
const formatoMoneda = (n) => `$${Number(n || 0).toLocaleString("es-AR")} ARS`;
const precioFinal = (p) => p.descuento ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const ratioResenas = (p) => p.resenas?.length ? p.resenas.filter((r) => r.voto === "positivo" || r.voto === "positiva").length / p.resenas.length : 0;
const FALLBACK_IMG = "/images/games/07-counter-strike-2/header.jpg";
const imagenJuego = (j) => j?.portada || j?.imagen || FALLBACK_IMG;
const Inicio = () => {
  const { productos = [] } = useProductos();
  const { isWishlisted, toggleWishlist } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState(""), [cat, setCat] = useState("Todas"), [orden, setOrden] = useState("destacados");
  const [destacadoId, setDestacadoId] = useState(null);
  const destacados5 = useMemo(() => productos.slice(0, 5), [productos]);
  const destacado = useMemo(() => productos.find((p) => String(p.id) === String(destacadoId)) || destacados5[0], [productos, destacadoId, destacados5]);
  const categorias = useMemo(() => ["Todas", ...new Set(productos.map((p) => p.categoria || p.genero).filter(Boolean))], [productos]);
  const hayFiltros = q.trim() !== "" || cat !== "Todas" || orden !== "destacados";
  const limpiarTodo = () => { setQ(""); setCat("Todas"); setOrden("destacados"); };
  const lista = useMemo(() => {
    const query = q.trim().toLowerCase();
    const filtrados = productos.filter((p) => {
      const matchCat = cat === "Todas" || p.categoria === cat || p.genero === cat;
      const texto = `${p.nombre} ${p.titulo || ""} ${p.desarrollador || ""} ${p.categoria || ""} ${p.genero || ""}`.toLowerCase();
      return matchCat && (!query || texto.includes(query));
    });
    const ordenados = [...filtrados];
    if (orden === "precio-asc") ordenados.sort((a, b) => precioFinal(a) - precioFinal(b));
    else if (orden === "precio-desc") ordenados.sort((a, b) => precioFinal(b) - precioFinal(a));
    else if (orden === "nombre") ordenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    else if (orden === "resenas") ordenados.sort((a, b) => ratioResenas(b) - ratioResenas(a));
    else if (orden === "destacados") ordenados.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
    return ordenados;
  }, [productos, q, cat, orden]);
  const alternarDeseo = (id) => {
    const r = toggleWishlist(id);
    if (r.requireAuth) navigate("/login");
  };
  if (!productos.length) return <div className="epic-box p-5 text-center my-4 text-secondary">El catálogo se encuentra vacío temporalmente.</div>;
  return (
    <>
      {destacado && (
        <section className="epic-hero-container mb-4">
          <Row className="g-0">
            <Col lg={8} className="epic-hero-main">
              <img
                className="epic-hero-image"
                src={imagenJuego(destacado)}
                alt={destacado.nombre}
                onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
              />
              <div className="epic-hero-overlay">
                <Badge bg="primary" className="align-self-start mb-2">DESTACADO</Badge>
                <h1 className="epic-heading epic-hero-title display-5 mb-2">{destacado.nombre}</h1>
                <p className="text-secondary col-lg-9 mb-3 text-truncate-2 small">{destacado.resumen || destacado.descripcion}</p>
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  <div className="d-flex flex-column">
                    {destacado.descuento > 0 && <span className="text-muted small text-decoration-line-through">{formatoMoneda(destacado.precio)}</span>}
                    <strong className="fs-4 text-light">{formatoMoneda(precioFinal(destacado))}</strong>
                  </div>
                  <Button as={Link} to={`/detalle/${destacado.id}`} className="btn-epic-primary">Ver detalle</Button>
                </div>
              </div>
            </Col>
            <Col lg={4} className="p-2 d-none d-lg-flex flex-column justify-content-between">
              {destacados5.map((j) => (
                <div key={j.id} className={`epic-hero-sidebar-item ${destacado.id === j.id ? "active" : ""}`} onClick={() => setDestacadoId(j.id)}>
                  <img
                    src={imagenJuego(j)}
                    alt={j.nombre}
                    className="epic-thumb"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                  />
                  <div className="text-truncate">
                    <div className="text-light fw-bold small text-truncate">{j.nombre}</div>
                    <span className="text-muted small">{formatoMoneda(precioFinal(j))}</span>
                  </div>
                </div>
              ))}
            </Col>
          </Row>
        </section>
      )}
      <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between mb-3">
        <div className="position-relative flex-grow-1">
          <Form.Control
            className="epic-input pe-5"
            placeholder="Buscar por título, estudio o género..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            maxLength={60}
          />
          {q && (
            <button type="button" className="btn btn-sm btn-link text-secondary position-absolute end-0 top-50 translate-middle-y me-2 text-decoration-none" onClick={() => setQ("")} aria-label="Limpiar búsqueda">
              ✕
            </button>
          )}
        </div>
        <div className="d-flex gap-2 flex-wrap align-items-center">
          {categorias.map((c) => <button key={c} className={`epic-filter-pill ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      </div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="text-secondary small">Ordenar por:</span>
          <Form.Select className="epic-input py-1 px-2 w-auto small" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="destacados">Destacados</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
            <option value="nombre">Nombre (A-Z)</option>
            <option value="resenas">Mejor valorados</option>
          </Form.Select>
          {hayFiltros && (
            <Button variant="link" size="sm" className="text-info p-0 ms-2 text-decoration-none small" onClick={limpiarTodo}>
              Limpiar filtros
            </Button>
          )}
        </div>
        <span className="text-secondary small">{lista.length} {lista.length === 1 ? "juego encontrado" : "juegos disponibles"}</span>
      </div>
      {lista.length > 0 ? (
        <Row xs={1} sm={2} lg={4} className="g-4">
          {lista.map((j) => (
            <Col key={j.id}>
              <article className="epic-card h-100">
                <div className="epic-card-media">
                  <img
                    src={imagenJuego(j)}
                    alt={j.nombre}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                  />
                  {j.descuento > 0 && <span className="epic-badge-discount position-absolute start-0 top-0 m-2">-{j.descuento}%</span>}
                  <button className={`epic-wishlist-btn ${isWishlisted(j.id) ? "active" : ""}`} onClick={() => alternarDeseo(j.id)} aria-label="Alternar deseo">
                    <i className={`bi ${isWishlisted(j.id) ? "bi-heart-fill" : "bi-heart"}`} />
                  </button>
                </div>
                <div className="pt-3">
                  <span className="epic-tag-category">{j.categoria}</span>
                  <h3 className="h6 text-light mt-1 mb-1 text-truncate">{j.nombre}</h3>
                  <p className="text-secondary small mb-2 text-truncate">{j.desarrollador}</p>
                  <div className="d-flex justify-content-between align-items-center gap-2">
                    <div className="d-flex flex-column">
                      {j.descuento > 0 && <span className="text-muted small text-decoration-line-through">{formatoMoneda(j.precio)}</span>}
                      <strong className="text-light">{formatoMoneda(precioFinal(j))}</strong>
                    </div>
                    <Button as={Link} to={`/detalle/${j.id}`} size="sm" variant="outline-light">Detalle</Button>
                  </div>
                </div>
              </article>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="epic-box p-5 text-center text-secondary">
          <i className="bi bi-search fs-1 d-block mb-2 text-muted" />
          <p className="mb-2">No se encontraron videojuegos que coincidan con los filtros seleccionados.</p>
          <Button variant="outline-info" size="sm" onClick={limpiarTodo}>Restablecer búsqueda</Button>
        </div>
      )}
    </>
  );
};
export default Inicio;
