import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProductos } from "../../../context/ProductosContext.jsx";

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
        {["nombre", "categoria", "desarrollador", "imagen"].map((n) => <Form.Group className="col-md-6" key={n}><Form.Label>{n}</Form.Label><Form.Control name={n} className="epic-input" value={form[n] || ""} onChange={set} required /></Form.Group>)}
        <Form.Group className="col-md-3"><Form.Label>precio</Form.Label><Form.Control name="precio" type="number" min="0" className="epic-input" value={form.precio} onChange={set} required /></Form.Group>
        <Form.Group className="col-md-3"><Form.Label>descuento</Form.Label><Form.Control name="descuento" type="number" min="0" max="100" className="epic-input" value={form.descuento} onChange={set} /></Form.Group>
        <Form.Group className="col-12"><Form.Label>resumen</Form.Label><Form.Control name="resumen" className="epic-input" value={form.resumen || ""} onChange={set} /></Form.Group>
        <Form.Group className="col-12"><Form.Label>descripcion</Form.Label><Form.Control as="textarea" rows={4} name="descripcion" className="epic-input" value={form.descripcion || ""} onChange={set} /></Form.Group>
        <div className="col-12 d-flex gap-2"><Button type="submit" className="btn-epic-primary">Guardar</Button><Button as={Link} to="/admin" variant="outline-secondary">Cancelar</Button></div>
      </Form>
    </section>
  );
};

export default FormularioProducto;
