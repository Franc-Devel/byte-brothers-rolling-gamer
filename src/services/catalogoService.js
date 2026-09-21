import juegosIniciales, { IDS_VARIANTES_RETIRADAS } from "../data/juegosIniciales.js";

export const PRODUCTOS_KEY = "productosKey";
const CATALOGO_VERSION_KEY = "productosCatalogoVersion";
const CATALOGO_VERSION = "steam-19-oficial-v1";

const catalogoInicialPorId = new Map(juegosIniciales.map((item) => [String(item.id), item]));
const esAssetLocal = (url) => typeof url === "string" && url.startsWith("/images/games/");

const guardarVersionCatalogo = () => localStorage.setItem(CATALOGO_VERSION_KEY, CATALOGO_VERSION);

const sincronizarAssetsLocales = (productos) => {
  const productosVigentes = productos.filter(
    (producto) => !IDS_VARIANTES_RETIRADAS.includes(String(producto?.id)),
  );
  let huboCambios = productosVigentes.length !== productos.length;
  const productosSincronizados = productosVigentes.map((producto) => {
    const base = catalogoInicialPorId.get(String(producto?.id));
    if (!base) return producto;

    const necesitaActualizar =
      !esAssetLocal(producto.imagen) ||
      !esAssetLocal(producto.portada) ||
      !Array.isArray(producto.galeria) ||
      producto.galeria.some((img) => !esAssetLocal(img));

    if (!necesitaActualizar) return producto;
    huboCambios = true;
    return {
      ...producto,
      imagen: base.imagen,
      portada: base.portada,
      galeria: base.galeria,
    };
  });

  if (huboCambios) {
    guardarProductos(productosSincronizados);
  }

  return productosSincronizados;
};

/**
 * Recupera el catálogo de videojuegos desde localStorage.
 * Garantiza que:
 * 1. Si no existe la clave o la versión del catálogo es anterior, se inicializa con los 19 juegos oficiales de Steam.
 * 2. Si ya existen datos bajo la versión vigente, se conservan las operaciones CRUD del administrador.
 * 3. Si los datos almacenados están corruptos, se recupera el catálogo base sin bloquear la aplicación.
 *
 * @returns {Array<Object>} Lista de videojuegos válidos
 */
export const obtenerProductos = () => {
  try {
    const versionGuardada = localStorage.getItem(CATALOGO_VERSION_KEY);
    const datosAlmacenados = localStorage.getItem(PRODUCTOS_KEY);

    // Si es primera carga o si el catálogo pertenece a una versión previa, se migra al dataset oficial de 19 juegos
    if (versionGuardada !== CATALOGO_VERSION || datosAlmacenados === null || datosAlmacenados === undefined) {
      guardarProductos(juegosIniciales);
      guardarVersionCatalogo();
      return [...juegosIniciales];
    }

    const productosParseados = JSON.parse(datosAlmacenados);

    if (Array.isArray(productosParseados)) {
      return sincronizarAssetsLocales(productosParseados);
    }

    console.warn("Los datos de productosKey no son un arreglo válido. Restaurando catálogo base de 19 juegos.");
    guardarProductos(juegosIniciales);
    guardarVersionCatalogo();
    return [...juegosIniciales];
  } catch (error) {
    console.error("Error al parsear productosKey desde localStorage. Recuperando datos base sin bloquearse:", error);
    guardarProductos(juegosIniciales);
    guardarVersionCatalogo();
    return [...juegosIniciales];
  }
};

/**
 * Persiste la lista de productos en localStorage bajo la clave acordada.
 *
 * @param {Array<Object>} productos Lista de videojuegos a persistir
 */
export const guardarProductos = (productos) => {
  try {
    if (!Array.isArray(productos)) {
      throw new Error("El valor a guardar en productosKey debe ser un arreglo.");
    }
    localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
  } catch (error) {
    console.error("Error al guardar productos en localStorage:", error);
  }
};

/**
 * Busca un producto en el catálogo persistente mediante su identificador.
 *
 * @param {string} id Identificador único del videojuego
 * @returns {Object|null} El producto coincidente o null si no se encuentra
 */
export const buscarProducto = (id) => {
  if (!id) return null;
  const productos = obtenerProductos();
  const productoEncontrado = productos.find((item) => String(item.id) === String(id));
  return productoEncontrado ? { ...productoEncontrado } : null;
};

/**
 * Crea un nuevo videojuego en el catálogo persistente asignando ID y estructura base.
 *
 * @param {Object} nuevoProducto Datos del videojuego a dar de alta
 * @returns {Object} El videojuego creado y persistido
 */
export const crearProducto = (nuevoProducto) => {
  if (!nuevoProducto || typeof nuevoProducto !== "object") {
    throw new Error("Datos inválidos para la creación del videojuego.");
  }

  const productosActuales = obtenerProductos();
  const nuevoId = nuevoProducto.id || `game-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const productoListo = {
    ...nuevoProducto,
    id: String(nuevoId),
    precio: Number(nuevoProducto.precio) || 0,
    descuento: Number(nuevoProducto.descuento) || 0,
    destacado: Boolean(nuevoProducto.destacado),
    resenas: Array.isArray(nuevoProducto.resenas) ? nuevoProducto.resenas : [],
    fechaLanzamiento: nuevoProducto.fechaLanzamiento || new Date().toISOString().split("T")[0]
  };

  const listaActualizada = [productoListo, ...productosActuales];
  guardarProductos(listaActualizada);

  return productoListo;
};

/**
 * Elimina un producto del catálogo persistente por su ID.
 *
 * @param {string} id Identificador único del videojuego a borrar
 * @returns {boolean} True si se eliminó, false si no se encontró
 */
export const borrarProducto = (id) => {
  if (!id) return false;

  const productosActuales = obtenerProductos();
  const productoExiste = productosActuales.some((item) => String(item.id) === String(id));

  if (!productoExiste) {
    return false;
  }

  const listaFiltrada = productosActuales.filter((item) => String(item.id) !== String(id));
  guardarProductos(listaFiltrada);

  return true;
};

/**
 * Modifica los datos de un producto existente garantizando la conservación de su ID y sus reseñas.
 *
 * @param {Object} productoActualizado Objeto con los nuevos valores del videojuego
 * @returns {Object} El producto modificado y persistido
 */
export const modificarProducto = (productoActualizado) => {
  if (!productoActualizado || !productoActualizado.id) {
    throw new Error("Se requiere un producto válido con ID para modificarlo.");
  }

  const productosActuales = obtenerProductos();
  const indice = productosActuales.findIndex(
    (item) => String(item.id) === String(productoActualizado.id)
  );

  if (indice === -1) {
    throw new Error(`No se encontró el videojuego con ID: ${productoActualizado.id}`);
  }

  const productoOriginal = productosActuales[indice];

  // Regla de aceptación: "editar conserva id y reseñas"
  const productoFusionado = {
    ...productoOriginal,
    ...productoActualizado,
    id: productoOriginal.id, // ID inmutable
    resenas: Array.isArray(productoOriginal.resenas) ? [...productoOriginal.resenas] : [], // Reseñas conservadas
    precio: Number(productoActualizado.precio !== undefined ? productoActualizado.precio : productoOriginal.precio) || 0,
    descuento: Number(productoActualizado.descuento !== undefined ? productoActualizado.descuento : productoOriginal.descuento) || 0,
    destacado: productoActualizado.destacado !== undefined ? Boolean(productoActualizado.destacado) : productoOriginal.destacado
  };

  productosActuales[indice] = productoFusionado;
  guardarProductos(productosActuales);

  return productoFusionado;
};

/**
 * Agrega una reseña comunitaria al videojuego especificado y actualiza la persistencia.
 *
 * @param {string} idJuego Identificador del videojuego sobre el que se opina
 * @param {Object} nuevaResena Datos de la reseña (usuario, comentario, esPositiva)
 * @returns {Object} El videojuego con la nueva reseña añadida
 */
export const agregarResena = (idJuego, nuevaResena) => {
  if (!idJuego || !nuevaResena) {
    throw new Error("Se requiere idJuego y los datos de la reseña.");
  }

  const productosActuales = obtenerProductos();
  const indice = productosActuales.findIndex((item) => String(item.id) === String(idJuego));

  if (indice === -1) {
    throw new Error(`Videojuego no encontrado con ID: ${idJuego}`);
  }

  const resenaPreparada = {
    id: nuevaResena.id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    usuario: nuevaResena.usuario || "Gamer Anónimo",
    fecha: nuevaResena.fecha || new Date().toISOString().split("T")[0],
    esPositiva: nuevaResena.esPositiva !== undefined ? Boolean(nuevaResena.esPositiva) : true,
    comentario: String(nuevaResena.comentario || "").trim()
  };

  const productoActual = productosActuales[indice];
  const resenasExistentes = Array.isArray(productoActual.resenas) ? productoActual.resenas : [];

  const productoConResena = {
    ...productoActual,
    resenas: [resenaPreparada, ...resenasExistentes]
  };

  productosActuales[indice] = productoConResena;
  guardarProductos(productosActuales);

  return productoConResena;
};

/**
 * Restaura el catálogo a los datos de fábrica iniciales persistiendo en productosKey.
 *
 * @returns {Array<Object>} Lista de videojuegos restaurados
 */
export const recargarCatalogoInicial = () => {
  guardarProductos(juegosIniciales);
  guardarVersionCatalogo();
  return [...juegosIniciales];
};
