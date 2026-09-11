import { useState, useEffect } from "react";
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

  return (
    <BrowserRouter>
      <main className="container py-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<div>Inicio ({productos.length} juegos)</div>} />
          <Route path="/administrador" element={<Navigate to="/admin" replace />} />
          <Route
            path="/admin"
            element={
              <div>
                Administrador ({productos.length})
                <button type="button" className="btn btn-sm btn-outline-secondary ms-2" onClick={() => setProductos(juegosIniciales)}>
                  Restablecer
                </button>
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/404" replace />} />
          <Route path="/404" element={<div>Página no encontrada</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
