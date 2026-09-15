import { useState } from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const FALLBACK_IMG = "https://placehold.co/100x60/1a1a1a/cccccc?text=Gamer";

const ItemProducto = ({ itemProducto, producto, fila, borrarProducto, onDelete }) => {
  const item = itemProducto || producto || {};
  const { id, nombre, desarrollador, categoria, precio, imagen, resenas = [] } = item;
  const [showConfirm, setShowConfirm] = useState(false);
  const eliminarFn = borrarProducto || onDelete;

  const precioFormat = `$${Number(precio || 0).toLocaleString("es-AR")}`;

  const calcAprobacion = () => {
    if (!Array.isArray(resenas) || resenas.length === 0) return { texto: "Sin reseñas", variant: "secondary", pct: null };
    const pos = resenas.filter((r) => r.voto === "positivo" || r.positiva === true).length;
    const pct = Math.round((pos / resenas.length) * 100);
    return {
      texto: `${pct}%`,
      subtexto: `(${resenas.length})`,
      variant: pct >= 70 ? "success" : pct >= 40 ? "warning" : "danger",
      pct,
    };
  };

  const aprob = calcAprobacion();

  const handleEliminar = () => {
    setShowConfirm(false);
    if (eliminarFn) {
      eliminarFn(id);
      window.alert?.(`El videojuego "${nombre}" fue eliminado correctamente.`);
    }
  };

  return (
    <>
      <tr className="align-middle">
        {fila !== undefined && <td className="text-secondary small fw-bold">#{fila}</td>}
        <td>
          <div className="d-flex align-items-center gap-2">
            <img
              src={imagen || FALLBACK_IMG}
              alt={nombre || "Portada"}
              className="rounded object-fit-cover"
              style={{ width: 52, height: 36 }}
              onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
            />
            <div>
              <span className="fw-bold text-light d-block text-truncate" style={{ maxWidth: 200 }}>
                {nombre || "Sin título"}
              </span>
              <small className="text-secondary d-block text-truncate" style={{ maxWidth: 180 }}>
                {desarrollador || "Desarrollador no especificado"}
              </small>
            </div>
          </div>
        </td>
        <td>
          <Badge bg="secondary" className="text-uppercase" style={{ fontSize: "0.72rem" }}>
            {categoria || "General"}
          </Badge>
        </td>
        <td className="fw-bold text-light">{precioFormat}</td>
        <td>
          <Badge bg={aprob.variant} className="small d-inline-flex align-items-center gap-1">
            {aprob.pct !== null && <i className="bi bi-hand-thumbs-up" />}
            <span>{aprob.texto}</span>
            {aprob.subtexto && <span className="opacity-75">{aprob.subtexto}</span>}
          </Badge>
        </td>
        <td className="text-end">
          <div className="d-inline-flex gap-1">
            <Button as={Link} to={`/detalle/${id}`} size="sm" variant="outline-light" title="Ver detalle">
              <i className="bi bi-eye" />
            </Button>
            <Button as={Link} to={`/editar/${id}`} size="sm" variant="outline-info" title="Editar juego">
              <i className="bi bi-pencil" />
            </Button>
            <Button size="sm" variant="outline-danger" onClick={() => setShowConfirm(true)} title="Eliminar juego">
              <i className="bi bi-trash" />
            </Button>
          </div>
        </td>
      </tr>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered size="sm" contentClassName="bg-dark text-light border-secondary">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="h6 mb-0">Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small text-secondary">
          ¿Estás seguro de que deseas eliminar permanentemente <strong>{nombre}</strong> del catálogo?
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button size="sm" variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancelar
          </Button>
          <Button size="sm" variant="danger" onClick={handleEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ItemProducto;
