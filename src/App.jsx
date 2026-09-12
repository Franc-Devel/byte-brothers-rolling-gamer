import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import juegosIniciales from "./data/juegosIniciales.js";

const PRODUCTOS_KEY = "productosKey";

function App() {
  const [productos, setProductos] = useState(() => {
    try {
      const guardados = localStorage.getItem(PRODUCTOS_KEY);
      const parsed = guardados ? JSON.parse(guardados) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : juegosIniciales;
    } catch {
      return juegosIniciales;
    }
  });

  useEffect(() => {
    localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
  }, [productos]);

  const buscarProducto = useCallback((id) => productos.find((p) => String(p.id) === String(id)), [productos]);

  const crearProducto = (nuevo) => {
    const item = { ...nuevo, id: nuevo.id || Date.now().toString(), resenas: nuevo.resenas || [] };
    setProductos((prev) => [item, ...prev]);
    return item;
  };

  const modificarProducto = (id, datos) => {
    setProductos((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? { ...p, ...datos, id: p.id, resenas: p.resenas || [] } : p))
    );
  };

  const borrarProducto = (id) => setProductos((prev) => prev.filter((p) => String(p.id) !== String(id)));

  const agregarResena = (idJuego, resena) => {
    setProductos((prev) =>
      prev.map((p) =>
        String(p.id) === String(idJuego)
          ? { ...p, resenas: [...(p.resenas || []), { ...resena, id: resena.id || Date.now().toString() }] }
          : p
      )
    );
  };

  return (
    <BrowserRouter>
      <main className="container py-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<div className="text-light">Inicio ({productos.length} juegos)</div>} />
          <Route path="/detalle/:id" element={<div className="text-light">Detalle (buscar: {typeof buscarProducto}, resenas: {typeof agregarResena})</div>} />
          <Route path="/login" element={<div className="text-light">Iniciar Sesión / Registro</div>} />
          <Route path="/wishlist" element={<div className="text-light">Lista de Deseos ({productos.length} catálogo)</div>} />
          <Route path="/about" element={<div className="text-light">Acerca del Equipo Rolling Gamer</div>} />
          <Route path="/administrador" element={<Navigate to="/admin" replace />} />
          <Route
            path="/admin"
            element={
              <div className="text-light">
                Panel de Administración ({productos.length} juegos)
                <button type="button" className="btn btn-sm btn-outline-secondary ms-2" onClick={() => setProductos(juegosIniciales)}>
                  Restablecer Catálogo
                </button>
              </div>
            }
          />
          <Route path="/crear" element={<div className="text-light">Crear Videojuego (crear: {typeof crearProducto})</div>} />
          <Route path="/editar/:id" element={<div className="text-light">Editar Videojuego (modificar: {typeof modificarProducto})</div>} />
          <Route path="/404" element={<div className="text-light">Error 404 — Página no encontrada (borrar: {typeof borrarProducto})</div>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
