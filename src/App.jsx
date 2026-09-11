import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <main className="container py-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<div>Inicio</div>} />
          <Route path="/administrador" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<div>Administrador</div>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
          <Route path="/404" element={<div>Página no encontrada</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
