import { createContext, useContext, useState, useCallback } from "react";
import {
  obtenerUsuarios, obtenerSesionActual, guardarSesionActual, eliminarSesionActual,
  registrarUsuario as regServicio, autenticarUsuario, eliminarUsuario as delServicio,
  obtenerWishlistDeCuenta, alternarDeseo, obtenerJuegosDeseados,
  USUARIOS_KEY, SESION_KEY, WISHLISTS_KEY
} from "../services/usuariosService.js";
import { obtenerProductos } from "../services/catalogoService.js";

const AuthContext = createContext();
export const USUARIO_KEY = SESION_KEY, USUARIOS_REGISTRADOS_KEY = USUARIOS_KEY;
export { USUARIOS_KEY, SESION_KEY, WISHLISTS_KEY };

export const AuthProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState(() => obtenerUsuarios());
  const [usuarioActual, setUsuarioActual] = useState(() => obtenerSesionActual());
  const [wishlistIds, setWishlistIds] = useState(() => obtenerWishlistDeCuenta(obtenerSesionActual()?.id));

  const login = useCallback((email, pass) => {
    const res = autenticarUsuario(email, pass);
    if (res.success) { setUsuarioActual(res.usuario); setWishlistIds(obtenerWishlistDeCuenta(res.usuario.id)); }
    return res;
  }, []);

  const register = useCallback((d, pass, nom) => {
    const res = regServicio(d, pass, nom);
    if (res.success) { setUsuarios(res.usuarios); setUsuarioActual(res.usuario); setWishlistIds(obtenerWishlistDeCuenta(res.usuario.id)); }
    return res;
  }, []);

  const logout = useCallback(() => {
    const res = eliminarSesionActual();
    setUsuarioActual(null); setWishlistIds([]);
    return res;
  }, []);

  const borrarUsuario = useCallback((id) => {
    const res = delServicio(id, usuarioActual?.id);
    if (res.success) setUsuarios(res.usuarios);
    return res;
  }, [usuarioActual]);

  const isWishlisted = useCallback((id) => usuarioActual ? wishlistIds.includes(String(id)) : false, [usuarioActual, wishlistIds]);

  const toggleWishlist = useCallback((id) => {
    if (!usuarioActual) return { success: false, exito: false, requireAuth: true, isWishlisted: false, wishlistIds: [], mensaje: "Debes iniciar sesión para gestionar tu lista de deseos." };
    const res = alternarDeseo(usuarioActual.id, id);
    if (res.success) setWishlistIds(res.wishlistIds);
    return res;
  }, [usuarioActual]);

  const getWishlistJuegos = useCallback((cat) => usuarioActual ? obtenerJuegosDeseados(usuarioActual.id, cat || obtenerProductos()) : [], [usuarioActual]);

  const loginRapido = useCallback((tipo) => {
    const c = obtenerUsuarios().find(u => u.rol === tipo);
    if (c) { const s = guardarSesionActual(c); setUsuarioActual(s); setWishlistIds(obtenerWishlistDeCuenta(s.id)); return s; }
    return null;
  }, []);

  const esAdmin = Boolean(usuarioActual?.rol === "admin"), estaAutenticado = Boolean(usuarioActual);

  return (
    <AuthContext.Provider value={{
      usuarios, usuarioActual, usuario: usuarioActual, cargando: false, esAdmin, estaAutenticado,
      login, register, logout, borrarUsuario, wishlistIds, isWishlisted, toggleWishlist, getWishlistJuegos, loginRapido
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  return c;
};

export default AuthContext;
