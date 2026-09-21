import { useState, useMemo } from "react";
import { Badge, Button, Card, Col, Form, InputGroup, Modal, Nav, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProductos } from "../../context/ProductosContext.jsx";
import ItemProducto from "./producto/ItemProducto.jsx";
const Administrador = () => {
  const { productos, borrarProducto, recargarCatalogo } = useProductos();
  const { usuarios, usuarioActual, borrarUsuario } = useAuth();
  const [tab, setTab] = useState("catalogo");
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("");
  const [modalReset, setModalReset] = useState(false);
  const categorias = useMemo(
    () => Array.from(new Set(productos.map((p) => p.categoria).filter(Boolean))).sort(),
    [productos]
  );
  const metricas = useMemo(() => ({
    juegos: productos.length,
    usuarios: usuarios.length,
    categorias: categorias.length,
    valorBase: `$${productos.reduce((acc, p) => acc + (Number(p.precio) || 0), 0).toLocaleString("es-AR")}`,
  }), [productos, usuarios, categorias]);
  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return productos.filter((p) => {
      const matchQ = !q || p.nombre?.toLowerCase().includes(q) || p.desarrollador?.toLowerCase().includes(q);
      const matchC = !categoria || p.categoria === categoria;
      return matchQ && matchC;
    });
  }, [productos, query, categoria]);
  const confirmarReset = () => {
    setModalReset(false);
    recargarCatalogo();
    Swal.fire({
      icon: "success",
      title: "Catálogo restablecido",
      text: "El inventario fue restaurado con éxito a los datos de fábrica.",
      background: "#18181c",
      color: "#f3f3f3",
      confirmButtonColor: "#0078f2",
      timer: 2000,
      showConfirmButton: false,
    });
  };
  const bajaUsuario = (u) => {
    if (String(u.id) === String(usuarioActual?.id)) {
      Swal.fire({
        icon: "info",
        title: "Acción no permitida",
        text: "No puedes eliminar la cuenta con la que has iniciado sesión.",
        background: "#18181c",
        color: "#f3f3f3",
        confirmButtonColor: "#0078f2",
      });
      return;
    }
    if (u.rol === "admin") {
      Swal.fire({
        icon: "warning",
        title: "Cuenta protegida",
        text: "Por seguridad de la plataforma, las cuentas con rol Administrador están protegidas contra eliminación.",
        background: "#18181c",
        color: "#f3f3f3",
        confirmButtonColor: "#0078f2",
      });
      return;
    }
    Swal.fire({
      title: "¿Confirmas la baja?",
      text: `¿Estás seguro de que deseas eliminar al usuario "${u.nombre}" (${u.email || u.correo})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, dar de baja",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#4a5568",
      background: "#18181c",
      color: "#f3f3f3",
    }).then((result) => {
      if (result.isConfirmed) {
        borrarUsuario(u.id);
        Swal.fire({
          icon: "success",
          title: "Usuario eliminado",
          text: `La cuenta de "${u.nombre}" fue dada de baja correctamente.`,
          background: "#18181c",
          color: "#f3f3f3",
          confirmButtonColor: "#0078f2",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };
  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="epic-subheading">Panel de Control</span>
          <h1 className="epic-heading h3 mb-0">Gestión de Plataforma</h1>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={() => setModalReset(true)}>
            <i className="bi bi-arrow-counterclockwise me-1" />Restaurar
          </Button>
          <Button as={Link} to="/crear" size="sm" className="btn-epic-primary">
            <i className="bi bi-plus-lg me-1" />Nuevo juego
          </Button>
        </div>
      </div>
      <Row className="g-2 g-md-3 mb-4">
        {[
          { label: "Catálogo", valor: metricas.juegos, desc: "Títulos totales", color: "text-light" },
          { label: "Comunidad", valor: metricas.usuarios, desc: "Usuarios activos", color: "text-info" },
          { label: "Géneros", valor: metricas.categorias, desc: "Categorías", color: "text-warning" },
          { label: "Valor Base", valor: metricas.valorBase, desc: "Suma de precios", color: "text-success" },
        ].map((m) => (
          <Col xs={6} md={3} key={m.label}>
            <div className="epic-box p-3 text-center h-100">
              <span className="epic-subheading d-block mb-1">{m.label}</span>
              <strong className={`h4 ${m.color} d-block mb-0`}>{m.valor}</strong>
              <small className="text-secondary">{m.desc}</small>
            </div>
          </Col>
        ))}
      </Row>
      <Nav variant="pills" className="bg-black rounded p-1 mb-3">
        <Nav.Item>
          <Nav.Link active={tab === "catalogo"} onClick={() => setTab("catalogo")}>
            <i className="bi bi-grid me-1" />Catálogo ({productos.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={tab === "usuarios"} onClick={() => setTab("usuarios")}>
            <i className="bi bi-people me-1" />Usuarios ({usuarios.length})
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {tab === "catalogo" ? (
        <Card className="epic-box p-3 mb-4 text-light">
          <div className="row g-2 mb-3 align-items-center">
            <div className="col-12 col-md-6">
              <InputGroup size="sm">
                <InputGroup.Text className="bg-dark border-secondary text-secondary">
                  <i className="bi bi-search" />
                </InputGroup.Text>
                <Form.Control
                  className="epic-input"
                  placeholder="Buscar por título o desarrollador..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  maxLength={60}
                />
                {query && (
                  <Button variant="outline-secondary" onClick={() => setQuery("")}>
                    <i className="bi bi-x" />
                  </Button>
                )}
              </InputGroup>
            </div>
            <div className="col-8 col-md-4">
              <Form.Select
                size="sm"
                className="epic-input"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-4 col-md-2 text-end">
              {(query || categoria) && (
                <Button size="sm" variant="outline-secondary" className="w-100" onClick={() => { setQuery(""); setCategoria(""); }}>
                  Limpiar
                </Button>
              )}
            </div>
          </div>
          <Table responsive hover variant="dark" className="epic-table mb-0 align-middle">
            <thead>
              <tr>
                <th style={{ width: 45 }}>#</th>
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
          <Table responsive hover variant="dark" className="epic-table mb-0 align-middle">
            <thead>
              <tr>
                <th style={{ width: 45 }}>#</th>
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
                const esAdmin = u.rol === "admin";
                const protegido = esPropia || esAdmin;
                return (
                  <tr key={u.id}>
                    <td className="text-secondary small">#{idx + 1}</td>
                    <td>
                      <span className="fw-bold text-light me-2">{u.nombre}</span>
                      {esPropia && (
                        <Badge bg="primary" className="small">
                          <i className="bi bi-person-check me-1" />Tú
                        </Badge>
                      )}
                    </td>
                    <td className="text-secondary small text-truncate" style={{ maxWidth: 200 }}>
                      {u.email || u.correo}
                    </td>
                    <td>
                      <Badge
                        bg={u.rol === "admin" ? "warning" : "info"}
                        text="dark"
                        className="text-uppercase"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {u.rol}
                      </Badge>
                    </td>
                    <td className="text-secondary small">
                      {u.fechaRegistro || u.fecha || "Preexistente"}
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant={protegido ? "secondary" : "outline-danger"}
                        disabled={protegido}
                        onClick={() => bajaUsuario(u)}
                        title={
                          esPropia
                            ? "Cuenta en uso actualmente"
                            : esAdmin
                            ? "Las cuentas de administrador están protegidas contra eliminación"
                            : "Dar de baja usuario"
                        }
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
      <Modal show={modalReset} onHide={() => setModalReset(false)} centered size="sm" contentClassName="bg-dark text-light border-secondary">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="h6 mb-0">¿Restaurar catálogo?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small text-secondary">
          Esta acción reemplazará los videojuegos actuales por los datos de fábrica iniciales de la tienda.
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button size="sm" variant="secondary" onClick={() => setModalReset(false)}>
            Cancelar
          </Button>
          <Button size="sm" variant="warning" onClick={confirmarReset}>
            Restablecer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Administrador;
