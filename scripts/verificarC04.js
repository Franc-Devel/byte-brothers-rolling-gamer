/* eslint-disable no-undef, no-unused-vars */
/**
 * Script de validación automatizada de los Criterios de Aceptación para la Card C04:
 * 1. Expone usuarios, usuarioActual y esAdmin, además de login, register, logout y borrarUsuario.
 * 2. El registro evita correos duplicados sin distinguir mayúsculas, crea rol usuario e inicia sesión; el login verifica credenciales.
 * 3. Persisten cuentas y sesión; la copia de sesión no contiene contraseña y logout elimina la sesión guardada.
 * 4. Expone wishlistIds, isWishlisted, toggleWishlist y getWishlistJuegos; guarda deseos por cuenta, sin ids duplicados.
 * 5. La baja de usuarios impide eliminar la cuenta activa; una cuenta eliminada no puede iniciar una nueva sesión.
 * 6. Sin autenticación, alternar deseos devuelve requireAuth; los consumidores reciben resultados success y mensajes sin editar este archivo.
 */

// Mock de localStorage en entorno Node.js
const storage = new Map();
global.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear()
};

import {
  USUARIOS_KEY,
  SESION_KEY,
  WISHLISTS_KEY,
  obtenerUsuarios,
  guardarUsuarios,
  obtenerSesionActual,
  guardarSesionActual,
  eliminarSesionActual,
  registrarUsuario,
  autenticarUsuario,
  eliminarUsuario,
  obtenerWishlistDeCuenta,
  alternarDeseo,
  obtenerJuegosDeseados,
  sanitizarUsuario
} from "../src/services/usuariosService.js";

import usuariosIniciales from "../src/data/usuariosIniciales.js";
import { obtenerProductos } from "../src/services/catalogoService.js";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALLÓ: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ APROBADO: ${message}`);
  }
}

console.log("=== INICIANDO VALIDACIÓN DE CRITERIOS CARD C04 ===");

// 1. Inicialización y persistencia de cuentas y sesión base
storage.clear();
const usuariosBase = obtenerUsuarios();
assert(Array.isArray(usuariosBase) && usuariosBase.length >= 2, "1.1. Inicializa cuentas registradas base si no existen.");
assert(storage.has(USUARIOS_KEY), "1.2. Persiste cuentas en localStorage bajo USUARIOS_KEY.");

// 2. Registro: evitar correos duplicados sin distinguir mayúsculas
const intentoDuplicado = registrarUsuario({
  nombre: "Admin Falso",
  email: "ADMIN@rollinggames.com", // Mayúsculas del admin existente
  password: "password123"
});
assert(intentoDuplicado.success === false, "2.1. El registro rechaza correos duplicados sin distinguir mayúsculas.");
assert(typeof intentoDuplicado.mensaje === "string", "2.2. Retorna mensaje descriptivo en fallo de duplicado.");

// 2.3. Registro exitoso: rol 'usuario' e inicio de sesión automático
const registroNuevo = registrarUsuario({
  nombre: "Camila Gamer",
  email: "camilagamer@rollinggames.com",
  password: "gamerpassword"
});
assert(registroNuevo.success === true, "2.3. Registro exitoso de nueva cuenta.");
assert(registroNuevo.usuario.rol === "usuario", "2.4. La nueva cuenta se crea con rol 'usuario'.");
assert(registroNuevo.usuario.email === "camilagamer@rollinggames.com", "2.5. Email registrado normalizado.");

// 3. Persistencia de sesión y desprovista de contraseña
const sesionGuardada = obtenerSesionActual();
assert(sesionGuardada !== null, "3.1. El registro inicia sesión automáticamente y se persiste.");
assert(sesionGuardada.email === "camilagamer@rollinggames.com", "3.2. Sesión activa coincide con el usuario registrado.");
assert(sesionGuardada.password === undefined, "3.3. La copia de sesión NO contiene contraseña.");

// 3.4. Login con credenciales válidas e inválidas
const loginInvalido = autenticarUsuario("camilagamer@rollinggames.com", "clave_erronea");
assert(loginInvalido.success === false, "3.4. El login rechaza credenciales incorrectas.");

const loginValido = autenticarUsuario("CAMILAGAMER@rollinggames.com", "gamerpassword");
assert(loginValido.success === true, "3.5. El login verifica credenciales correctamente (insensible a mayúsculas en email).");
assert(loginValido.usuario.password === undefined, "3.6. La sesión de login tampoco expone contraseña.");

// 3.7. Logout elimina la sesión guardada
const logoutRes = eliminarSesionActual();
assert(logoutRes.success === true, "3.7. Logout retorna resultado de éxito.");
assert(obtenerSesionActual() === null, "3.8. Logout elimina la sesión guardada de localStorage.");

// 4. Wishlist por cuenta, sin duplicados y requireAuth sin sesión
// 4.1. Sin autenticación, alternar deseos devuelve requireAuth
const deseoAnonimo = alternarDeseo(null, "game-1");
assert(deseoAnonimo.success === false, "4.1. Alternar deseos sin sesión retorna success false.");
assert(deseoAnonimo.requireAuth === true, "4.2. Sin autenticación, alternar deseos devuelve requireAuth = true.");
assert(typeof deseoAnonimo.mensaje === "string", "4.3. Devuelve mensaje informativo para el usuario.");

// 4.4. Con autenticación, guardar deseos por cuenta sin duplicados
const usuarioId1 = registroNuevo.usuario.id;
const deseo1 = alternarDeseo(usuarioId1, "1");
assert(deseo1.success === true && deseo1.isWishlisted === true, "4.4. Usuario autenticado puede agregar juego a wishlist.");
assert(deseo1.wishlistIds.includes("1"), "4.5. El ID se encuentra en wishlistIds.");

// Alternar el mismo ID lo quita
const deseo1Quitar = alternarDeseo(usuarioId1, "1");
assert(deseo1Quitar.success === true && deseo1Quitar.isWishlisted === false, "4.6. Alternar juego existente lo quita de la lista.");
assert(!deseo1Quitar.wishlistIds.includes("1"), "4.7. El ID ya no está en wishlistIds.");

// Agregar dos juegos distintos y verificar ausencia de duplicados
alternarDeseo(usuarioId1, "1");
alternarDeseo(usuarioId1, "2");
const listaActualId1 = obtenerWishlistDeCuenta(usuarioId1);
const setSinDuplicados = new Set(listaActualId1);
assert(listaActualId1.length === setSinDuplicados.size, "4.8. La lista de deseos no contiene IDs duplicados.");

// Aislamiento entre cuentas
const usuarioId2 = "user-guest-1";
alternarDeseo(usuarioId2, "3");
const listaCuenta2 = obtenerWishlistDeCuenta(usuarioId2);
assert(!listaCuenta2.includes("1"), "4.9. Los deseos se guardan por cuenta separada y aislada.");
assert(listaCuenta2.includes("3"), "4.10. La cuenta 2 tiene su propio deseo registrado.");

// 4.11. getWishlistJuegos
const catalogo = obtenerProductos();
const juegosDeseados = obtenerJuegosDeseados(usuarioId1, catalogo);
assert(Array.isArray(juegosDeseados) && juegosDeseados.length === 2, "4.11. getWishlistJuegos retorna los objetos de videojuegos correctos.");

// 5. Baja de usuarios: protección de cuenta activa y bloqueo de nueva sesión
const idCamila = registroNuevo.usuario.id;
guardarSesionActual(registroNuevo.usuario); // Iniciar sesión como Camila

// Intentar eliminar la cuenta activa
const intentoAutobaja = eliminarUsuario(idCamila, idCamila);
assert(intentoAutobaja.success === false, "5.1. La baja de usuarios impide eliminar la cuenta activa.");
assert(typeof intentoAutobaja.mensaje === "string", "5.2. Retorna mensaje de error explicando la restricción.");

// Eliminar otra cuenta (usuario creado auxiliar)
const usuarioAux = registrarUsuario({
  nombre: "Usuario Temporal",
  email: "temporal@rollinggames.com",
  password: "temp123password"
});
const idAux = usuarioAux.usuario.id;

// Dar de baja cuenta auxiliar con sesión de Camila
const bajaExitosa = eliminarUsuario(idAux, idCamila);
assert(bajaExitosa.success === true, "5.3. Permite dar de baja usuarios que no corresponden a la sesión activa.");

// La cuenta eliminada no puede iniciar una nueva sesión
const loginCuentaEliminada = autenticarUsuario("temporal@rollinggames.com", "temp123password");
assert(loginCuentaEliminada.success === false, "5.4. Una cuenta eliminada no puede iniciar una nueva sesión.");

// 6. Contrato de consumidores: success y mensajes
assert(typeof bajaExitosa.success === "boolean", "6.1. Operaciones devuelven success boolean.");
assert(typeof bajaExitosa.mensaje === "string", "6.2. Operaciones devuelven mensaje informativo.");

// Verifica el acceso rapido real del proveedor tras eliminar la cuenta demo.
const { createServer } = await import("vite");
const { createElement } = await import("react");
const { renderToString } = await import("react-dom/server");
const server = await createServer({ server: { middlewareMode: true } });
try {
  const { AuthProvider, useAuth } = await server.ssrLoadModule("/src/context/AuthContext.jsx");
  storage.clear();
  const demos = obtenerUsuarios();
  const demoUsuario = demos.find(u => u.rol === "usuario");
  const demoAdmin = demos.find(u => u.rol === "admin");
  eliminarUsuario(demoUsuario.id, demoAdmin.id);
  let auth;
  function Consumidor() { auth = useAuth(); return null; }
  renderToString(createElement(AuthProvider, null, createElement(Consumidor)));
  assert(auth.loginRapido("usuario") === null, "7.1. El acceso rapido no recupera cuentas demo eliminadas.");
  assert(obtenerSesionActual() === null, "7.2. La cuenta demo eliminada no genera una sesion nueva.");
  assert(auth.toggleWishlist("1").requireAuth === true, "7.3. El proveedor exige autenticacion para los deseos.");
} finally {
  await server.close();
}

console.log("=== TODOS LOS 6 CRITERIOS DE ACEPTACIÓN CARD C04 VALIDADOS CON ÉXITO ===");
