import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const RutaProtegida = ({ children, soloAdmin = false }) => {
  const { usuarioActual, esAdmin } = useAuth();
  if (!usuarioActual) return <Navigate to="/login" replace />;
  if (soloAdmin && !esAdmin) return <Navigate to="/" replace />;
  return children;
};

export default RutaProtegida;
