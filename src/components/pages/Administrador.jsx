import { useState, useMemo } from "react";
import { Badge, Button, Card, Col, Form, InputGroup, Modal, Nav, Row, Table } from "react-bootstrap";
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
  const [showRestaurar, setShowRestaurar] = useState(false);

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

  const handleRestaurar = () => {
    setShowRestaurar(false);
    recargarCatalogo();
    window.alert?.("Catálogo de videojuegos restablecido con éxito a los datos de fábrica.");
  };

  const eliminarUsuario = (u) => {
    if (String(u.id) === String(usuarioActual?.id)) {
      window.alert?.("No puedes eliminar la cuenta con la que has iniciado sesión.");
      return;
    }
    if (window.confirm(`¿Confirmas la baja de la cuenta "${u.nombre}" (${u.email || u.correo})?`)) {
      borrarUsuario(u.id);
    }
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
          <Button variant="outline-secondary" onClick={() => setShowRestaurar(true)}>
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
              <tr>
                <th style={{ width: 50 }}>#</th>
                <th>Identidad</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Fecha de alta</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, idx) => {
                const esPropia = String(u.id) === String(usuarioActual?.id);
                return (
                  <tr key={u.id} className="align-middle">
                    <td className="text-secondary small">#{idx + 1}</td>
                    <td>
                      <span className="fw-bold text-light me-2">{u.nombre}</span>
                      {esPropia && (
                        <Badge bg="primary" className="small">
                          <i className="bi bi-person-check me-1" />Tú
                        </Badge>
                      )}
                    </td>
                    <td className="text-secondary">{u.email || u.correo}</td>
                    <td>
                      <Badge bg={u.rol === "admin" ? "warning" : "info"} text="dark" className="text-uppercase" style={{ fontSize: "0.72rem" }}>
                        {u.rol}
                      </Badge>
                    </td>
                    <td className="text-secondary small">
                      {u.fechaRegistro || u.fecha || "Preexistente"}
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant={esPropia ? "secondary" : "outline-danger"}
                        disabled={esPropia}
                        onClick={() => eliminarUsuario(u)}
                        title={esPropia ? "Cuenta en uso actualmente" : "Dar de baja usuario"}
                      >
                        <i className="bi bi-trash me-1" />Baja
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Modal de confirmación para restablecer catálogo */}
      <Modal show={showRestaurar} onHide={() => setShowRestaurar(false)} centered size="sm" contentClassName="bg-dark text-light border-secondary">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="h6 mb-0">¿Restaurar catálogo?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small text-secondary">
          Esta acción reemplazará los videojuegos actuales por los datos de fábrica iniciales de la tienda.
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button size="sm" variant="secondary" onClick={() => setShowRestaurar(false)}>
            Cancelar
          </Button>
          <Button size="sm" variant="warning" onClick={handleRestaurar}>
            Restablecer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Administrador;
