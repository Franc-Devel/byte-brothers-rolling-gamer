import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import juegosIniciales from "./data/juegosIniciales.js";

const KEY = "productosKey";

function App() {
  const [productos, setProductos] = useState(() => {
    try {
      const g = localStorage.getItem(KEY);
      const p = g ? JSON.parse(g) : null;
      return Array.isArray(p) && p.length > 0 ? p : juegosIniciales;
    } catch { return juegosIniciales; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(productos)); }, [productos]);

  const buscar = useCallback((id) => productos.find((p) => String(p.id) === String(id)), [productos]);
  const crear = (n) => { const item = { ...n, id: n.id || Date.now().toString(), resenas: n.resenas || [] }; setProductos((prev) => [item, ...prev]); return item; };
  const modificar = (id, d) => setProductos((prev) => prev.map((p) => (String(p.id) === String(id) ? { ...p, ...d, id: p.id, resenas: p.resenas || [] } : p)));
  const borrar = (id) => setProductos((prev) => prev.filter((p) => String(p.id) !== String(id)));
  const resena = (id, r) => setProductos((prev) => prev.map((p) => String(p.id) === String(id) ? { ...p, resenas: [...(p.resenas || []), { ...r, id: r.id || Date.now().toString() }] } : p));

  return (
    <BrowserRouter>
      <AuthProvider>
        <main className="container py-4 flex-grow-1 text-light">
          <Routes>
            <Route path="/" element={<div>Inicio ({productos.length})</div>} />
            <Route path="/detalle/:id" element={<div>Detalle (buscar: {typeof buscar}, resena: {typeof resena})</div>} />
            <Route path="/login" element={<div>Iniciar Sesión / Registro</div>} />
            <Route path="/wishlist" element={<div>Lista de Deseos ({productos.length})</div>} />
            <Route path="/about" element={<div>Equipo Rolling Gamer</div>} />
            <Route path="/administrador" element={<Navigate to="/admin" replace />} />
            <Route path="/admin" element={<div>Panel Admin ({productos.length}) <button type="button" className="btn btn-sm btn-outline-secondary ms-2" onClick={() => setProductos(juegosIniciales)}>Restablecer</button></div>} />
            <Route path="/crear" element={<div>Crear (crear: {typeof crear})</div>} />
            <Route path="/editar/:id" element={<div>Editar (modificar: {typeof modificar})</div>} />
            <Route path="/404" element={<div>Error 404 (borrar: {typeof borrar})</div>} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
