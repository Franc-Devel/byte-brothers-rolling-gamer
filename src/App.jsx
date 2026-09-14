import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/common/Footer.jsx";
import Menu from "./components/common/Menu.jsx";
import About from "./components/pages/About.jsx";
import Error404 from "./components/pages/Error404.jsx";
import Inicio from "./components/pages/Inicio.jsx";
import Login from "./components/pages/Login.jsx";
import Wishlist from "./components/pages/Wishlist.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProductosProvider } from "./context/ProductosContext.jsx";
import { UIModalProvider } from "./context/UIModalContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIModalProvider>
          <ProductosProvider>
            <Menu />
            <main className="container py-4 flex-grow-1 text-light">
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/detalle/:id" element={<div>Detalle</div>} />
                <Route path="/login" element={<Login />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/about" element={<About />} />
                <Route path="/administrador" element={<Navigate to="/admin" replace />} />
                <Route path="/admin" element={<div>Panel Admin</div>} />
                <Route path="/crear" element={<div>Crear</div>} />
                <Route path="/editar/:id" element={<div>Editar</div>} />
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
