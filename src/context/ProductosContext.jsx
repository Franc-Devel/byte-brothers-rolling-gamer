import { createContext, useCallback, useContext, useState } from "react";
import {
  agregarResena as agregarResenaSrv,
  borrarProducto as borrarProductoSrv,
  buscarProducto as buscarProductoSrv,
  crearProducto as crearProductoSrv,
  modificarProducto as modificarProductoSrv,
  obtenerProductos,
  recargarCatalogoInicial
} from "../services/catalogoService.js";
const ProductosContext = createContext();
export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState(() => obtenerProductos());
  const refrescar = () => setProductos(obtenerProductos());
  const crearProducto = useCallback((d) => { const p = crearProductoSrv(d); refrescar(); return p; }, []);
  const modificarProducto = useCallback((d) => { const p = modificarProductoSrv(d); refrescar(); return p; }, []);
  const borrarProducto = useCallback((id) => { const ok = borrarProductoSrv(id); if (ok) refrescar(); return ok; }, []);
  const agregarResena = useCallback((id, d) => { const p = agregarResenaSrv(id, d); refrescar(); return p; }, []);
  const recargarCatalogo = useCallback(() => { const p = recargarCatalogoInicial(); setProductos(p); return p; }, []);
  return (
    <ProductosContext.Provider value={{ productos, cargando: false, crearProducto, modificarProducto, borrarProducto, buscarProducto: buscarProductoSrv, agregarResena, recargarCatalogo }}>
      {children}
    </ProductosContext.Provider>
  );
};
export const useProductos = () => {
  const ctx = useContext(ProductosContext);
  if (!ctx) throw new Error("useProductos debe usarse dentro de ProductosProvider");
  return ctx;
};
export default ProductosContext;
