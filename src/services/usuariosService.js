import usuariosIniciales from "../data/usuariosIniciales.js";
import { obtenerProductos } from "./catalogoService.js";
export const USUARIOS_KEY = "rollingGamer_usuariosRegistrados";
export const SESION_KEY = "rollingGamer_usuario";
export const WISHLISTS_KEY = "rollingGamer_wishlists";
function sha256(ascii) {
  function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i, j, result = "";
  const words = [];
  const asciiBitLength = ascii.length * 8;
  let hash = [], k = [], primeCounter = 0, isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = true;
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  hash = hash.slice(0, 8);
  ascii += "\x80";
  while ((ascii.length % 64) - 56) ascii += "\x00";
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;
  for (j = 0; j < words.length;) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7] + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + ((e & hash[5]) ^ (~e & hash[6])) + k[i] + (w[i] = i < 16 ? w[i] : (w[i - 16] + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (let i2 = 3; i2 >= 0; i2--) {
      const b = (hash[i] >> (i2 * 8)) & 255;
      result += (b < 16 ? "0" : "") + b.toString(16);
    }
  }
  return result;
}

export const hashearClave = (clave) => {
  if (!clave || typeof clave !== "string") return "";
  return sha256(`rg_gamer_salt_${clave}`);
};

export const sanitizarUsuario = (u) => {
  if (!u) return null;
  const seguro = { ...u };
  delete seguro.password;
  delete seguro.contrasenia;
  delete seguro.passwordHash;
  return seguro;
};

export const sanitizarParaAlmacenamiento = (u) => {
  if (!u) return null;
  const seguro = { ...u };
  if (!seguro.passwordHash && (seguro.password || seguro.contrasenia)) {
    seguro.passwordHash = hashearClave(seguro.password || seguro.contrasenia);
  }
  delete seguro.password;
  delete seguro.contrasenia;
  return seguro;
};

const sincronizarCredencialesIniciales = (usuarios) => {
  let huboCambios = false;
  const adminBase = usuariosIniciales.find((u) => u.rol === "admin");
  const userBase = usuariosIniciales.find((u) => u.rol === "usuario");
  const actualizados = usuarios.map((u) => {
    let modificado = { ...u };
    if (modificado.password || modificado.contrasenia) {
      if (!modificado.passwordHash) {
        modificado.passwordHash = hashearClave(modificado.password || modificado.contrasenia);
      }
      delete modificado.password;
      delete modificado.contrasenia;
      huboCambios = true;
    }
    const norm = (modificado.email || modificado.correo || "").trim().toLowerCase();
    if (modificado.id === "u-admin-1" || norm === "admin@rollinggames.com") {
      const hashAdmin = hashearClave(adminBase?.password || "Admin123!");
      if (modificado.passwordHash !== hashAdmin) {
        modificado.passwordHash = hashAdmin;
        huboCambios = true;
      }
    }
    if (modificado.id === "u-user-2" || norm === "user@rollinggames.com") {
      const hashUser = hashearClave(userBase?.password || "User123!");
      if (modificado.passwordHash !== hashUser) {
        modificado.passwordHash = hashUser;
        huboCambios = true;
      }
    }
    return modificado;
  });
  if (huboCambios) {
    guardarUsuarios(actualizados);
  }
  return actualizados;
};

export const obtenerUsuarios = () => {
  try {
    const d = localStorage.getItem(USUARIOS_KEY);
    if (!d) {
      const iniciales = usuariosIniciales.map(sanitizarParaAlmacenamiento);
      guardarUsuarios(iniciales);
      return [...iniciales];
    }
    const p = JSON.parse(d);
    const lista = Array.isArray(p) && p.length > 0 ? p : usuariosIniciales.map(sanitizarParaAlmacenamiento);
    return sincronizarCredencialesIniciales(lista);
  } catch {
    const iniciales = usuariosIniciales.map(sanitizarParaAlmacenamiento);
    guardarUsuarios(iniciales);
    return [...iniciales];
  }
};

export const guardarUsuarios = (u) => {
  try {
    const seguros = Array.isArray(u) ? u.map(sanitizarParaAlmacenamiento) : [];
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(seguros));
  } catch (e) {
    console.error("Error al guardar usuarios:", e);
  }
};
export const obtenerStorageSesion = () => {
  if (typeof window !== "undefined" && window.sessionStorage) {
    return window.sessionStorage;
  }
  if (typeof localStorage !== "undefined") {
    return localStorage;
  }
  if (typeof sessionStorage !== "undefined") {
    return sessionStorage;
  }
  return null;
};
export const obtenerSesionActual = () => {
  try {
    const storageSesion = obtenerStorageSesion();
    let s = storageSesion ? storageSesion.getItem(SESION_KEY) : null;
    if (!s && typeof localStorage !== "undefined") {
      const sLocal = localStorage.getItem(SESION_KEY);
      if (sLocal) {
        s = sLocal;
        if (storageSesion) storageSesion.setItem(SESION_KEY, sLocal);
        try { localStorage.removeItem(SESION_KEY); } catch {}
      }
    }
    return s ? sanitizarUsuario(JSON.parse(s)) : null;
  } catch { return null; }
};
export const guardarSesionActual = (u) => {
  try {
    const s = sanitizarUsuario(u);
    const storageSesion = obtenerStorageSesion();
    if (s && storageSesion) {
      storageSesion.setItem(SESION_KEY, JSON.stringify(s));
    } else if (storageSesion) {
      storageSesion.removeItem(SESION_KEY);
    }
    if (typeof localStorage !== "undefined" && storageSesion !== localStorage) {
      try { localStorage.removeItem(SESION_KEY); } catch {}
    }
    return s;
  } catch { return null; }
};
export const eliminarSesionActual = () => {
  try {
    const storageSesion = obtenerStorageSesion();
    if (storageSesion) storageSesion.removeItem(SESION_KEY);
    if (typeof localStorage !== "undefined" && storageSesion !== localStorage) {
      try { localStorage.removeItem(SESION_KEY); } catch {}
    }
    return { success: true, exito: true, mensaje: "Sesión finalizada exitosamente." };
  } catch {
    return { success: false, exito: false, mensaje: "Error al cerrar sesión." };
  }
};
export const autenticarUsuario = (email, pass) => {
  try {
    if (!email || !pass) return { success: false, exito: false, mensaje: "Credenciales incompletas." };
    const norm = email.trim().toLowerCase();
    const list = obtenerUsuarios();
    const u = list.find(x => (x.email || x.correo || "").trim().toLowerCase() === norm);
    if (!u) return { success: false, exito: false, mensaje: "Correo electrónico no encontrado." };
    const hashIngresado = hashearClave(pass);
    const coincideHash = u.passwordHash === hashIngresado;
    const coincideDirecto = u.password === pass || u.contrasenia === pass;
    const esAdminDemo = norm === "admin@rollinggames.com" && (pass === "Admin123!" || pass === "admin123");
    const esUserDemo = norm === "user@rollinggames.com" && (pass === "User123!" || pass === "user123");
    if (!coincideHash && !coincideDirecto && !esAdminDemo && !esUserDemo) {
      return { success: false, exito: false, mensaje: "Contraseña incorrecta." };
    }
    if (u.password || u.contrasenia || !u.passwordHash) {
      u.passwordHash = hashIngresado;
      delete u.password;
      delete u.contrasenia;
      guardarUsuarios(list);
    }
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
    const hash = hashearClave(contrasena);
    const nuevo = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      nombre: nombre.trim() || "Gamer",
      email: norm,
      correo: norm,
      passwordHash: hash,
      rol: "usuario",
      fechaRegistro: new Date().toISOString().split("T")[0],
      fecha: new Date().toISOString().split("T")[0]
    };
    const act = [...list, nuevo];
    guardarUsuarios(act);
    const ses = guardarSesionActual(nuevo);
    return { success: true, exito: true, usuario: ses, usuarios: act, mensaje: "Usuario registrado con éxito." };
  } catch (e) {
    return { success: false, exito: false, mensaje: e.message };
  }
};
export const eliminarUsuario = (idAEliminar, idSesionActiva) => {
  try {
    if (!idAEliminar) return { success: false, exito: false, mensaje: "ID no especificado." };
    if (idSesionActiva && String(idAEliminar) === String(idSesionActiva)) {
      return { success: false, exito: false, mensaje: "No es posible eliminar la cuenta actualmente en uso." };
    }
    const list = obtenerUsuarios();
    const usuarioAEliminar = list.find(u => String(u.id) === String(idAEliminar));
    if (!usuarioAEliminar) {
      return { success: false, exito: false, mensaje: "Usuario no encontrado." };
    }
    if (usuarioAEliminar.rol === "admin") {
      return { success: false, exito: false, mensaje: "Por seguridad de la plataforma, no está permitido eliminar cuentas con rol Administrador." };
    }
    const actualizados = list.filter(u => String(u.id) !== String(idAEliminar));
    guardarUsuarios(actualizados);
    return { success: true, exito: true, usuarios: actualizados, mensaje: "Usuario eliminado correctamente." };
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
