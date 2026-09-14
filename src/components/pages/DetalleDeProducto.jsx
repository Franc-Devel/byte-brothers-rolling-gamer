import { useState } from "react";
import { Alert, Badge, Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProductos } from "../../context/ProductosContext.jsx";

const ok = (r) => r.esPositiva ?? r.voto !== "negativo";
const specs = (r = {}) => [["SO", r.so], ["CPU", r.cpu || r.procesador], ["RAM", r.ram || r.memoria], ["GPU", r.gpu || r.graficos], ["Disco", r.almacenamiento]];

const DetalleDeProducto = () => {
  const { id } = useParams(), navigate = useNavigate();
  const { buscarProducto, agregarResena } = useProductos();
  const { usuarioActual, isWishlisted, toggleWishlist } = useAuth();
  const juego = buscarProducto(id);
  const [comentario, setComentario] = useState(""), [positivo, setPositivo] = useState(true), [msg, setMsg] = useState("");
  if (!juego) return <div className="text-center py-5"><h1 className="h3">Videojuego no encontrado</h1><Button as={Link} to="/">Volver</Button></div>;

  const resenas = juego.resenas || [], porc = resenas.length ? Math.round(resenas.filter(ok).length * 100 / resenas.length) : 100;
  const desear = () => { const r = toggleWishlist(juego.id); if (r.requireAuth) navigate("/login"); };
  const enviar = (e) => {
    e.preventDefault();
    if (!usuarioActual) return navigate("/login");
    if (!comentario.trim()) return setMsg("Escribi una opinion antes de publicar.");
    agregarResena(juego.id, { usuario: usuarioActual.nombre, comentario, esPositiva: positivo });
    setComentario(""); setMsg("Resena publicada.");
  };

  return (
    <>
      <Link to="/" className="text-secondary text-decoration-none small"><i className="bi bi-arrow-left me-1" />Volver al catalogo</Link>
      <Row className="g-4 mt-2">
        <Col lg={7}><img src={juego.imagen} alt={juego.nombre} className="w-100 rounded object-fit-cover" style={{ maxHeight: 480 }} /></Col>
        <Col lg={5}>
          <div className="epic-box p-4 h-100">
            <Badge bg="primary" className="mb-2">{juego.categoria}</Badge>
            <h1 className="epic-heading h2">{juego.nombre}</h1>
            <p className="text-secondary">{juego.descripcion || juego.resumen}</p>
            <p className="small text-secondary mb-1">Desarrollador: <strong className="text-light">{juego.desarrollador}</strong></p>
            <p className="small text-secondary">Resenas: <strong className="text-light">{porc}% positivas</strong> ({resenas.length})</p>
            <div className="d-flex flex-wrap gap-2 align-items-center mt-4">
              <strong className="fs-3">${Number(juego.precio).toLocaleString("es-AR")} ARS</strong>
              {juego.descuento > 0 && <Badge bg="success">-{juego.descuento}%</Badge>}
            </div>
            <Button className="btn-epic-primary w-100 mt-3">Agregar al carrito</Button>
            <Button variant={isWishlisted(juego.id) ? "danger" : "outline-light"} className="w-100 mt-2" onClick={desear}>
              <i className={`bi ${isWishlisted(juego.id) ? "bi-heart-fill" : "bi-heart"} me-1`} />{isWishlisted(juego.id) ? "Quitar de deseos" : "Guardar en deseos"}
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="g-3 my-4">
        {["minimos", "recomendados"].map((tipo) => (
          <Col md={6} key={tipo}>
            <Card className="epic-specs-col h-100 text-light">
              <h2 className="epic-specs-title">{tipo}</h2>
              <ul className="list-unstyled small text-secondary mb-0">{specs(juego.requisitos?.[tipo]).map(([k, v]) => <li key={k}><strong>{k}:</strong> {v || "No informado"}</li>)}</ul>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <h2 className="epic-heading h4">Resenas</h2>
          {resenas.map((r) => <Card className="epic-box p-3 mb-2 text-light" key={r.id}><strong>{r.usuario || r.autor}</strong><span className={ok(r) ? "text-success small" : "text-warning small"}>{ok(r) ? " Recomendado" : " No recomendado"}</span><p className="text-secondary small mb-0">{r.comentario}</p></Card>)}
        </Col>
        <Col lg={5}>
          <Card className="epic-box p-3 text-light">
            <h2 className="h5">Publicar opinion</h2>
            {msg && <Alert variant={msg.includes("publicada") ? "success" : "warning"}>{msg}</Alert>}
            <Form onSubmit={enviar}>
              <Form.Check type="switch" label="La recomiendo" checked={positivo} onChange={(e) => setPositivo(e.target.checked)} className="mb-2" />
              <Form.Control as="textarea" rows={4} className="epic-input mb-3" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Tu resena" />
              <Button type="submit" className="btn-epic-primary w-100">Publicar</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DetalleDeProducto;
