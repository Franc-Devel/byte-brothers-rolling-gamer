import { useMemo, useState } from "react";
import { Badge, Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProductos } from "../../context/ProductosContext.jsx";

const precio = (n) => `$${Number(n || 0).toLocaleString("es-AR")} ARS`;

const Inicio = () => {
  const { productos } = useProductos();
  const { isWishlisted, toggleWishlist } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState(""), [cat, setCat] = useState("Todas");
  const categorias = useMemo(() => ["Todas", ...new Set(productos.map((p) => p.categoria).filter(Boolean))], [productos]);
  const lista = useMemo(() => productos.filter((p) => {
    const texto = `${p.nombre} ${p.titulo} ${p.desarrollador} ${p.categoria}`.toLowerCase();
    return (cat === "Todas" || p.categoria === cat) && texto.includes(q.toLowerCase());
  }), [productos, q, cat]);
  const destacado = productos.find((p) => p.destacado) || productos[0];

  const deseo = (id) => {
    const r = toggleWishlist(id);
    if (r.requireAuth) navigate("/login");
  };

  return (
    <>
      {destacado && (
        <section className="epic-hero-container mb-4">
          <div className="epic-hero-main">
            <img className="epic-hero-image" src={destacado.imagen} alt={destacado.nombre} />
            <div className="epic-hero-overlay">
              <Badge bg="primary" className="align-self-start mb-2">DESTACADO</Badge>
              <h1 className="epic-heading display-5 mb-2">{destacado.nombre}</h1>
              <p className="text-secondary col-lg-7">{destacado.resumen || destacado.descripcion}</p>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <strong className="fs-4">{precio(destacado.precio)}</strong>
                <Button as={Link} to={`/detalle/${destacado.id}`} className="btn-epic-primary">Ver detalle</Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between mb-4">
        <Form.Control className="epic-input" placeholder="Buscar por titulo, estudio o genero" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="d-flex gap-2 flex-wrap">
          {categorias.map((c) => <button key={c} className={`epic-filter-pill ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-end mb-3">
        <div>
          <span className="epic-subheading">Tienda</span>
          <h2 className="epic-heading h4 mb-0">Catalogo disponible</h2>
        </div>
        <span className="text-secondary small">{lista.length} juegos</span>
      </div>

      <Row xs={1} sm={2} lg={4} className="g-4">
        {lista.map((j) => (
          <Col key={j.id}>
            <article className="epic-card h-100">
              <div className="epic-card-media">
                <img src={j.imagen} alt={j.nombre} />
                {j.descuento > 0 && <span className="epic-badge-discount position-absolute start-0 top-0 m-2">-{j.descuento}%</span>}
                <button className={`epic-wishlist-btn ${isWishlisted(j.id) ? "active" : ""}`} onClick={() => deseo(j.id)} aria-label="Alternar deseo">
                  <i className={`bi ${isWishlisted(j.id) ? "bi-heart-fill" : "bi-heart"}`} />
                </button>
              </div>
              <div className="pt-3">
                <span className="epic-tag-category">{j.categoria}</span>
                <h3 className="h6 text-light mt-1 mb-1">{j.nombre}</h3>
                <p className="text-secondary small mb-2">{j.desarrollador}</p>
                <div className="d-flex justify-content-between align-items-center gap-2">
                  <strong>{precio(j.precio)}</strong>
                  <Button as={Link} to={`/detalle/${j.id}`} size="sm" variant="outline-light">Detalle</Button>
                </div>
              </div>
            </article>
          </Col>
        ))}
      </Row>
      {lista.length === 0 && <p className="epic-box p-4 text-center text-secondary">No hay juegos para esos filtros.</p>}
    </>
  );
};

export default Inicio;
