import { useState } from "react";
import { Badge, Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProductos } from "../../../context/ProductosContext.jsx";

const CATEGORIAS = [
  "Acción",
  "Aventura",
  "RPG",
  "Estrategia",
  "Deportes",
  "Simulación",
  "Indie",
  "Carreras",
  "Terror",
  "Disparos",
];

const base = {
  nombre: "",
  categoria: "Acción",
  precio: 0,
  descuento: 0,
  desarrollador: "",
  editor: "",
  lanzamiento: "",
  imagen: "",
  galeria: "",
  resumen: "",
  descripcion: "",
};

const FormularioProducto = ({
  titulo: tituloProp,
  crearProducto: crearProp,
  modificarProducto: modProp,
  buscarProducto: buscarProp,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productosCtx = useProductos();

  const buscar = buscarProp || productosCtx?.buscarProducto;
  const crear = crearProp || productosCtx?.crearProducto;
  const modificar = modProp || productosCtx?.modificarProducto;

  const editando = Boolean(id);
  const juegoExistente = editando && buscar ? buscar(id) : null;
  const idInvalido = editando && !juegoExistente;

  const [form, setForm] = useState(() => {
    if (editando && juegoExistente) {
      return { ...base, ...juegoExistente };
    }
    return base;
  });

  const tituloPagina = tituloProp || (editando ? "Editar videojuego" : "Crear videojuego");

  if (idInvalido) {
    return (
      <section className="epic-box p-5 text-center my-4 shadow">
        <i className="bi bi-exclamation-triangle display-4 text-warning mb-3 d-block" />
        <h1 className="epic-heading h3 mb-2">Videojuego no encontrado</h1>
        <p className="text-secondary mb-4">
          No se encontró ningún videojuego en el catálogo con el identificador <code>{id}</code>.
        </p>
        <Button as={Link} to="/admin" className="btn-epic-primary">
          <i className="bi bi-arrow-left me-2" />Volver al panel administrativo
        </Button>
      </section>
    );
  }

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const enviar = (e) => {
    e.preventDefault();
    const listo = { ...form, precio: Number(form.precio), descuento: Number(form.descuento), titulo: form.nombre, genero: form.categoria, portada: form.imagen };
    editando ? modificar(listo) : crear(listo);
    navigate("/admin");
  };

  return (
    <section className="epic-box p-4">
      <Link to="/admin" className="text-secondary text-decoration-none small d-inline-flex align-items-center mb-3">
        <i className="bi bi-arrow-left me-1" />Volver al panel
      </Link>
      <h1 className="epic-heading h3 mb-3">{tituloPagina}</h1>

      <Form onSubmit={enviar} className="row g-3">
        {/* Información básica */}
        <Form.Group className="col-md-6">
          <Form.Label className="small text-secondary fw-semibold">Título del videojuego *</Form.Label>
          <Form.Control
            name="nombre"
            className="epic-input"
            placeholder="Ej. Cyberpunk 2077: Phantom Liberty"
            value={form.nombre || ""}
            onChange={set}
            required
            minLength={2}
          />
        </Form.Group>

        <Form.Group className="col-md-6">
          <Form.Label className="small text-secondary fw-semibold">Categoría / Género *</Form.Label>
          <Form.Select
            name="categoria"
            className="epic-input"
            value={form.categoria || "Acción"}
            onChange={set}
            required
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat} className="bg-dark text-light">
                {cat}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="col-md-4">
          <Form.Label className="small text-secondary fw-semibold">Estudio / Desarrollador *</Form.Label>
          <Form.Control
            name="desarrollador"
            className="epic-input"
            placeholder="Ej. CD Projekt Red"
            value={form.desarrollador || ""}
            onChange={set}
            required
          />
        </Form.Group>

        <Form.Group className="col-md-4">
          <Form.Label className="small text-secondary fw-semibold">Editor / Distribuidor</Form.Label>
          <Form.Control
            name="editor"
            className="epic-input"
            placeholder="Ej. CD Projekt"
            value={form.editor || ""}
            onChange={set}
          />
        </Form.Group>

        <Form.Group className="col-md-4">
          <Form.Label className="small text-secondary fw-semibold">Fecha de lanzamiento</Form.Label>
          <Form.Control
            name="lanzamiento"
            type="date"
            className="epic-input"
            value={form.lanzamiento || ""}
            onChange={set}
          />
        {/* Precios y descuentos */}
        <Form.Group className="col-md-6">
          <Form.Label className="small text-secondary fw-semibold">Precio (ARS) * (mínimo $50)</Form.Label>
          <Form.Control
            name="precio"
            type="number"
            min="50"
            step="1"
            className="epic-input"
            placeholder="Ej. 15000"
            value={form.precio}
            onChange={set}
            required
          />
        </Form.Group>

        <Form.Group className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <Form.Label className="small text-secondary fw-semibold mb-0">Descuento (%) (0 a 90)</Form.Label>
            {Number(form.descuento) > 0 && (
              <Badge bg="success" className="small">
                Final: ${Math.round(Number(form.precio || 0) * (1 - Math.min(90, Number(form.descuento)) / 100)).toLocaleString("es-AR")} ARS
              </Badge>
            )}
          </div>
          <Form.Control
            name="descuento"
            type="number"
            min="0"
            max="90"
            className="epic-input"
            placeholder="0 a 90"
            value={form.descuento}
            onChange={set}
          />
        </Form.Group>
        <Form.Group className="col-12"><Form.Label>resumen</Form.Label><Form.Control name="resumen" className="epic-input" value={form.resumen || ""} onChange={set} /></Form.Group>
        <Form.Group className="col-12"><Form.Label>descripcion</Form.Label><Form.Control as="textarea" rows={4} name="descripcion" className="epic-input" value={form.descripcion || ""} onChange={set} /></Form.Group>
        <div className="col-12 d-flex gap-2"><Button type="submit" className="btn-epic-primary">Guardar</Button><Button as={Link} to="/admin" variant="outline-secondary">Cancelar</Button></div>
      </Form>
    </section>
  );
};

export default FormularioProducto;
