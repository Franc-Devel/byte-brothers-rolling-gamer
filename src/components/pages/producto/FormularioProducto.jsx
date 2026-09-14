import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProductos } from "../../../context/ProductosContext.jsx";

const base = { nombre: "", categoria: "Accion", precio: 0, descuento: 0, desarrollador: "", imagen: "", resumen: "", descripcion: "" };

const FormularioProducto = () => {
  const { id } = useParams(), navigate = useNavigate();
  const { buscarProducto, crearProducto, modificarProducto } = useProductos();
  const [form, setForm] = useState(base), editando = Boolean(id);
  useEffect(() => { if (id) setForm({ ...base, ...buscarProducto(id) }); }, [id, buscarProducto]);
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const enviar = (e) => {
    e.preventDefault();
    const listo = { ...form, precio: Number(form.precio), descuento: Number(form.descuento), titulo: form.nombre, genero: form.categoria, portada: form.imagen };
    editando ? modificarProducto(listo) : crearProducto(listo);
    navigate("/admin");
  };

  return (
    <section className="epic-box p-4">
      <Link to="/admin" className="text-secondary text-decoration-none small">Volver al panel</Link>
      <h1 className="epic-heading h3 my-3">{editando ? "Editar videojuego" : "Crear videojuego"}</h1>
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
