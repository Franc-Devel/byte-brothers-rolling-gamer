import usuariosIniciales from "../data/usuariosIniciales.js";
import { obtenerProductos } from "./catalogoService.js";

export const USUARIOS_KEY = "rollingGamer_usuariosRegistrados";
export const SESION_KEY = "rollingGamer_usuario";
export const WISHLISTS_KEY = "rollingGamer_wishlists";

export const sanitizarUsuario = (u) => {
  if (!u) return null;
  // eslint-disable-next-line no-unused-vars
  const { password, contrasenia, ...seguro } = u;
  return seguro;
};

export const obtenerUsuarios = () => {
  try {
    const d = localStorage.getItem(USUARIOS_KEY);
    if (!d) {
      localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosIniciales));
      return [...usuariosIniciales];
    }
    const p = JSON.parse(d);
    return Array.isArray(p) && p.length > 0 ? p : [...usuariosIniciales];
  } catch {
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosIniciales));
    return [...usuariosIniciales];
  }
};

export const guardarUsuarios = (u) => {
  try { localStorage.setItem(USUARIOS_KEY, JSON.stringify(u)); } catch (e) { console.error(e); }
};

export const obtenerSesionActual = () => {
  try {
    const s = localStorage.getItem(SESION_KEY);
    return s ? sanitizarUsuario(JSON.parse(s)) : null;
  } catch { return null; }
};

export const guardarSesionActual = (u) => {
  try {
    const s = sanitizarUsuario(u);
    if (s) localStorage.setItem(SESION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESION_KEY);
    return s;
  } catch { return null; }
};

export const eliminarSesionActual = () => {
  try {
    localStorage.removeItem(SESION_KEY);
    return { success: true, exito: true, mensaje: "Sesión finalizada exitosamente." };
  } catch {
    return { success: false, exito: false, mensaje: "Error al cerrar sesión." };
  }
};

export const autenticarUsuario = (email, pass) => {
  try {
    if (!email || !pass) return { success: false, exito: false, mensaje: "Credenciales incompletas." };
    const norm = email.trim().toLowerCase();
    const u = obtenerUsuarios().find(x => (x.email || x.correo || "").trim().toLowerCase() === norm);
    if (!u) return { success: false, exito: false, mensaje: "Correo electrónico no encontrado." };
    if (u.password !== pass && u.contrasenia !== pass) return { success: false, exito: false, mensaje: "Contraseña incorrecta." };
    const ses = guardarSesionActual(u);
    return { success: true, exito: true, usuario: ses, mensaje: "Autenticación satisfactoria." };
  } catch (e) {
    return { success: false, exito: false, mensaje: e.message };
  }
};

export const registrarUsuario = (datosOEmail, pass = "", nom = "") => {
  try {
    let email = "", contrasena = "", nombre = "";
    if (typeof datosOEmail === "object" && datosOEmail !== null) {
      email = datosOEmail.email || datosOEmail.correo || "";
      contrasena = datosOEmail.password || datosOEmail.contrasenia || "";
      nombre = datosOEmail.nombre || "";
    } else {
      email = datosOEmail || "";
      contrasena = pass || "";
      nombre = nom || (email ? email.split("@")[0] : "Usuario");
    }
    if (!email.trim() || !contrasena) return { success: false, exito: false, mensaje: "Email y contraseña requeridos." };
    const norm = email.trim().toLowerCase();
    const list = obtenerUsuarios();
    if (list.some(u => (u.email || u.correo || "").trim().toLowerCase() === norm)) {
      return { success: false, exito: false, mensaje: "El correo electrónico ya está registrado." };
    }
    const nuevo = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      nombre: nombre.trim() || "Gamer",
      email: norm,
      correo: norm,
      password: contrasena,
      contrasenia: contrasena,
      rol: "usuario",
      fechaRegistro: new Date().toISOString().split("T")[0],
      fecha: new Date().toISOString().split("T")[0]
    };
    const act = [...list, nuevo];
    guardarUsuarios(act);
    const ses = sanitizarUsuario(nuevo);
    localStorage.setItem(SESION_KEY, JSON.stringify(ses));
    return { success: true, exito: true, usuario: ses, usuarios: act, mensaje: "Usuario registrado con éxito." };
  } catch (e) {
    return { success: false, exito: false, mensaje: e.message };
  }
};

export const obtenerWishlists = () => {
  try {
    const d = localStorage.getItem(WISHLISTS_KEY);
    return d ? JSON.parse(d) : {};
  } catch { return {}; }
};

export const guardarWishlists = (w) => {
  try { localStorage.setItem(WISHLISTS_KEY, JSON.stringify(w)); } catch (e) { console.error(e); }
};

export const obtenerWishlistDeCuenta = (usuarioId) => {
  if (!usuarioId) return [];
  const map = obtenerWishlists();
  if (map[usuarioId] && Array.isArray(map[usuarioId])) return map[usuarioId];
  const u = obtenerUsuarios().find(x => String(x.id) === String(usuarioId));
  return (u && Array.isArray(u.wishlist)) ? u.wishlist.map(String) : [];
};

export const alternarDeseo = (usuarioId, juegoId) => {
  try {
    if (!usuarioId) {
      return { success: false, exito: false, requireAuth: true, isWishlisted: false, wishlistIds: [], mensaje: "Debes iniciar sesión para gestionar tu lista de deseos." };
    }
    const idStr = String(juegoId);
    const map = obtenerWishlists();
    const actual = obtenerWishlistDeCuenta(usuarioId);
    const existe = actual.includes(idStr);
    const nueva = existe ? actual.filter(x => x !== idStr) : [...new Set([...actual, idStr])];
    map[usuarioId] = nueva;
    guardarWishlists(map);
    return { success: true, exito: true, requireAuth: false, isWishlisted: !existe, wishlistIds: nueva, mensaje: !existe ? "Agregado a la lista de deseos." : "Removido de la lista de deseos." };
  } catch (e) {
    return { success: false, exito: false, mensaje: e.message };
  }
};

export const obtenerJuegosDeseados = (usuarioId, catalogoOpcional) => {
  try {
    const ids = obtenerWishlistDeCuenta(usuarioId);
    const cat = Array.isArray(catalogoOpcional) ? catalogoOpcional : obtenerProductos();
    return cat.filter(j => ids.includes(String(j.id)));
  } catch { return []; }
};
