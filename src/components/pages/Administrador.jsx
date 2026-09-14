import { Badge, Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProductos } from "../../context/ProductosContext.jsx";

const Administrador = () => {
  const { productos, borrarProducto, recargarCatalogo } = useProductos();
  const { usuarios, usuarioActual, borrarUsuario } = useAuth();
  const eliminarJuego = (p) => window.confirm(`Eliminar ${p.nombre}?`) && borrarProducto(p.id);
  const eliminarUsuario = (u) => {
    const r = String(u.id) === String(usuarioActual?.id) ? { success: false, mensaje: "No podes borrar la cuenta activa." } : window.confirm(`Dar de baja a ${u.nombre}?`) && borrarUsuario(u.id);
    if (r?.mensaje) window.alert(r.mensaje);
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div><span className="epic-subheading">Admin</span><h1 className="epic-heading h3 mb-0">Gestion de plataforma</h1></div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => window.confirm("Restaurar catalogo inicial?") && recargarCatalogo()}>Restaurar</Button>
          <Button as={Link} to="/crear" className="btn-epic-primary">Nuevo juego</Button>
        </div>
      </div>

      <Card className="epic-box p-3 mb-4 text-light">
        <h2 className="h5">Catalogo ({productos.length})</h2>
        <Table responsive hover variant="dark" className="epic-table mb-0">
          <thead><tr><th>Juego</th><th>Categoria</th><th>Precio</th><th className="text-end">Acciones</th></tr></thead>
          <tbody>{productos.map((p) => (
            <tr key={p.id}>
              <td><img src={p.imagen} alt="" className="rounded object-fit-cover me-2" style={{ width: 52, height: 36 }} />{p.nombre}</td>
              <td><Badge bg="secondary">{p.categoria}</Badge></td>
              <td>${Number(p.precio).toLocaleString("es-AR")}</td>
              <td className="text-end">
                <Button as={Link} to={`/editar/${p.id}`} size="sm" variant="outline-info" className="me-2">Editar</Button>
                <Button size="sm" variant="outline-danger" onClick={() => eliminarJuego(p)}>Borrar</Button>
              </td>
            </tr>
          ))}</tbody>
        </Table>
      </Card>

      <Card className="epic-box p-3 text-light">
        <h2 className="h5">Usuarios ({usuarios.length})</h2>
        <Table responsive hover variant="dark" className="epic-table mb-0">
          <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th className="text-end">Acciones</th></tr></thead>
          <tbody>{usuarios.map((u) => (
            <tr key={u.id}><td>{u.nombre}</td><td>{u.email || u.correo}</td><td>{u.rol}</td><td className="text-end"><Button size="sm" variant="outline-danger" onClick={() => eliminarUsuario(u)}>Baja</Button></td></tr>
          ))}</tbody>
        </Table>
      </Card>
    </>
  );
};

export default Administrador;
