import { Badge } from "react-bootstrap";

const FALLBACK_IMG = "https://placehold.co/100x60/1a1a1a/cccccc?text=Gamer";

const ItemProducto = ({ itemProducto, producto, fila }) => {
  const item = itemProducto || producto || {};
  const { id, nombre, desarrollador, categoria, precio, imagen } = item;
  const precioFormat = `$${Number(precio || 0).toLocaleString("es-AR")}`;

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
    </tr>
  );
};

export default ItemProducto;
