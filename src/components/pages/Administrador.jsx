import { useState, useMemo } from "react";
import { Button, Card, Col, Form, InputGroup, Nav, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProductos } from "../../context/ProductosContext.jsx";
import ItemProducto from "./producto/ItemProducto.jsx";

const Administrador = () => {
  const { productos, borrarProducto, recargarCatalogo } = useProductos();
  const { usuarios, usuarioActual, borrarUsuario } = useAuth();
  const [tabActiva, setTabActiva] = useState("catalogo");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSel, setCategoriaSel] = useState("");

  const categorias = useMemo(
    () => Array.from(new Set(productos.map((p) => p.categoria).filter(Boolean))).sort(),
    [productos]
  );

  const metricas = useMemo(() => {
    const cats = new Set(productos.map((p) => p.categoria).filter(Boolean));
    const suma = productos.reduce((acc, p) => acc + (Number(p.precio) || 0), 0);
    return {
      totalJuegos: productos.length,
      totalUsuarios: usuarios.length,
      totalCategorias: cats.size,
      sumaPrecios: `$${suma.toLocaleString("es-AR")}`,
    };
  }, [productos, usuarios]);

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    return productos.filter((p) => {
      const matchTexto = !term ||
        p.nombre?.toLowerCase().includes(term) ||
        p.desarrollador?.toLowerCase().includes(term);
      const matchCat = !categoriaSel || p.categoria === categoriaSel;
      return matchTexto && matchCat;
    });
  }, [productos, busqueda, categoriaSel]);

  const eliminarUsuario = (u) => {
    const r = String(u.id) === String(usuarioActual?.id)
      ? { success: false, mensaje: "No podes borrar la cuenta activa." }
      : window.confirm(`Dar de baja a ${u.nombre}?`) && borrarUsuario(u.id);
    if (r?.mensaje) window.alert(r.mensaje);
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoriaSel("");
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="epic-subheading">Panel de Control</span>
          <h1 className="epic-heading h3 mb-0">Gestión de Plataforma</h1>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => window.confirm("Restaurar catalogo inicial?") && recargarCatalogo()}>
            <i className="bi bi-arrow-counterclockwise me-1" />Restaurar
          </Button>
          <Button as={Link} to="/crear" className="btn-epic-primary">
            <i className="bi bi-plus-lg me-1" />Nuevo juego
          </Button>
        </div>
      </div>

      {/* Tarjetas de métricas globales */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <div className="epic-box p-3 text-center">
            <span className="epic-subheading d-block mb-1">Catálogo</span>
            <strong className="h4 text-light d-block mb-0">{metricas.totalJuegos}</strong>
            <small className="text-secondary">Juegos totales</small>
          </div>
        </Col>
        <Col xs={6} md={3}>
          <div className="epic-box p-3 text-center">
            <span className="epic-subheading d-block mb-1">Comunidad</span>
            <strong className="h4 text-info d-block mb-0">{metricas.totalUsuarios}</strong>
            <small className="text-secondary">Usuarios registrados</small>
          </div>
        </Col>
        <Col xs={6} md={3}>
          <div className="epic-box p-3 text-center">
            <span className="epic-subheading d-block mb-1">Géneros</span>
            <strong className="h4 text-warning d-block mb-0">{metricas.totalCategorias}</strong>
            <small className="text-secondary">Categorías únicas</small>
          </div>
        </Col>
        <Col xs={6} md={3}>
          <div className="epic-box p-3 text-center">
            <span className="epic-subheading d-block mb-1">Precios Base</span>
            <strong className="h5 text-success d-block mb-0">{metricas.sumaPrecios}</strong>
            <small className="text-secondary">Valor del catálogo</small>
          </div>
        </Col>
      </Row>

      {/* Pestañas de gestión */}
      <Nav variant="pills" className="bg-black rounded p-1 mb-3">
        <Nav.Item>
          <Nav.Link active={tabActiva === "catalogo"} onClick={() => setTabActiva("catalogo")}>
            <i className="bi bi-grid me-1" />Catálogo ({productos.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={tabActiva === "usuarios"} onClick={() => setTabActiva("usuarios")}>
            <i className="bi bi-people me-1" />Usuarios ({usuarios.length})
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {tabActiva === "catalogo" ? (
        <Card className="epic-box p-3 mb-4 text-light">
          {/* Barra de búsqueda y filtros */}
          <div className="row g-2 mb-3 align-items-center">
            <div className="col-12 col-md-6">
              <InputGroup size="sm">
                <InputGroup.Text className="bg-dark border-secondary text-secondary">
                  <i className="bi bi-search" />
                </InputGroup.Text>
                <Form.Control
                  className="epic-input"
                  placeholder="Buscar por título o estudio..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <Button variant="outline-secondary" onClick={() => setBusqueda("")}>
                    <i className="bi bi-x" />
                  </Button>
                )}
              </InputGroup>
            </div>
            <div className="col-8 col-md-4">
              <Form.Select
                size="sm"
                className="epic-input"
                value={categoriaSel}
                onChange={(e) => setCategoriaSel(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-4 col-md-2 text-end">
              {(busqueda || categoriaSel) && (
                <Button size="sm" variant="outline-secondary" className="w-100" onClick={limpiarFiltros}>
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          <Table responsive hover variant="dark" className="epic-table mb-0">
            <thead>
              <tr>
                <th style={{ width: 50 }}>#</th>
                <th>Juego</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Aprobación</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length > 0 ? (
                filtrados.map((p, idx) => (
                  <ItemProducto
                    key={p.id}
                    itemProducto={p}
                    fila={idx + 1}
                    borrarProducto={borrarProducto}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-secondary">
                    No se encontraron videojuegos coincidentes con el filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      ) : (
        <Card className="epic-box p-3 text-light">
          <Table responsive hover variant="dark" className="epic-table mb-0">
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Rol</th><th className="text-end">Acciones</th></tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email || u.correo}</td>
                  <td>{u.rol}</td>
                  <td className="text-end">
                    <Button size="sm" variant="outline-danger" onClick={() => eliminarUsuario(u)}>Baja</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </>
  );
};

export default Administrador;
