import { Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const FALLBACK_IMG = "https://placehold.co/100x60/1a1a1a/cccccc?text=Gamer";

const ItemProducto = ({ itemProducto, producto, fila }) => {
  const item = itemProducto || producto || {};
  const { id, nombre, desarrollador, categoria, precio, imagen, resenas = [] } = item;
  const precioFormat = `$${Number(precio || 0).toLocaleString("es-AR")}`;

  const calcAprobacion = () => {
    if (!Array.isArray(resenas) || resenas.length === 0) return { texto: "Sin reseñas", variant: "secondary", pct: null };
    const pos = resenas.filter((r) => r.voto === "positivo" || r.positiva === true).length;
    const pct = Math.round((pos / resenas.length) * 100);
    return {
      texto: `${pct}% (${resenas.length})`,
      variant: pct >= 70 ? "success" : pct >= 40 ? "warning" : "danger",
      pct,
    };
  };

  const aprob = calcAprobacion();

  return (
    <tr className="align-middle">
      {fila !== undefined && <td className="text-secondary small">#{fila}</td>}
      <td>
        <div className="d-flex align-items-center gap-2">
          <img
            src={imagen || FALLBACK_IMG}
            alt={nombre || "Videojuego"}
            className="rounded object-fit-cover"
            style={{ width: 56, height: 38 }}
            onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
          />
          <div>
            <span className="fw-bold text-light d-block text-truncate" style={{ maxWidth: 220 }}>
              {nombre || "Sin título"}
            </span>
            <small className="text-secondary d-block text-truncate" style={{ maxWidth: 200 }}>
              {desarrollador || "Estudio no especificado"}
            </small>
          </div>
        </div>
      </td>
      <td>
        <Badge bg="secondary" className="text-uppercase" style={{ fontSize: "0.75rem" }}>
          {categoria || "General"}
        </Badge>
      </td>
      <td className="fw-bold text-light">{precioFormat}</td>
      <td>
        <Badge bg={aprob.variant} className="small">
          {aprob.pct !== null && <i className="bi bi-hand-thumbs-up me-1" />}
          {aprob.texto}
        </Badge>
      </td>
      <td className="text-end">
        <div className="d-inline-flex gap-1">
          <Button as={Link} to={`/detalle/${id}`} size="sm" variant="outline-light" title="Ver detalle del juego">
            <i className="bi bi-eye" />
          </Button>
          <Button as={Link} to={`/editar/${id}`} size="sm" variant="outline-info" title="Editar juego">
            <i className="bi bi-pencil" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ItemProducto;
