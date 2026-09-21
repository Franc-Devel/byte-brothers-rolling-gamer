import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/common/Footer.jsx";
import Menu from "./components/common/Menu.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import About from "./components/pages/About.jsx";
import Administrador from "./components/pages/Administrador.jsx";
import DetalleDeProducto from "./components/pages/DetalleDeProducto.jsx";
import Error404 from "./components/pages/Error404.jsx";
import Inicio from "./components/pages/Inicio.jsx";
import Login from "./components/pages/Login.jsx";
import FormularioProducto from "./components/pages/producto/FormularioProducto.jsx";
import Wishlist from "./components/pages/Wishlist.jsx";
import RutaProtegida from "./components/common/RutaProtegida.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProductosProvider } from "./context/ProductosContext.jsx";
import { UIModalProvider } from "./context/UIModalContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <UIModalProvider>
          <ProductosProvider>
            <Menu />
            <main className="container py-4 flex-grow-1 text-light">
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/detalle/:id" element={<DetalleDeProducto />} />
                <Route path="/producto/:id" element={<DetalleDeProducto />} />
                <Route path="/login" element={<Login />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/about" element={<About />} />
                <Route path="/administrador" element={<Navigate to="/admin" replace />} />
                <Route path="/admin" element={<RutaProtegida soloAdmin><Administrador /></RutaProtegida>} />
                <Route path="/crear" element={<RutaProtegida soloAdmin><FormularioProducto /></RutaProtegida>} />
                <Route path="/editar/:id" element={<RutaProtegida soloAdmin><FormularioProducto /></RutaProtegida>} />
                <Route path="/404" element={<Error404 />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </main>
            <Footer />
          </ProductosProvider>
        </UIModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
