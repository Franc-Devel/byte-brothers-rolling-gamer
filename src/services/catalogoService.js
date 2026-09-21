import juegosIniciales, { IDS_VARIANTES_RETIRADAS } from "../data/juegosIniciales.js";

export const PRODUCTOS_KEY = "productosKey";
const CATALOGO_VERSION_KEY = "productosCatalogoVersion";
const CATALOGO_VERSION = "steam-19-categorias-v2";

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
      producto.galeria.some((img) => !esAssetLocal(img)) ||
      producto.categoria !== base.categoria ||
      producto.genero !== base.genero;

    if (!necesitaActualizar) return producto;
    huboCambios = true;
    return {
      ...producto,
      categoria: base.categoria,
      genero: base.genero,
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

export const obtenerProductos = () => {
  try {
    const versionGuardada = localStorage.getItem(CATALOGO_VERSION_KEY);
    const datosAlmacenados = localStorage.getItem(PRODUCTOS_KEY);

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

export const buscarProducto = (id) => {
  if (!id) return null;
  const productos = obtenerProductos();
  const productoEncontrado = productos.find((item) => String(item.id) === String(id));
  return productoEncontrado ? { ...productoEncontrado } : null;
};

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

  const productoFusionado = {
    ...productoOriginal,
    ...productoActualizado,
    id: productoOriginal.id,
    resenas: Array.isArray(productoOriginal.resenas) ? [...productoOriginal.resenas] : [],
    precio: Number(productoActualizado.precio !== undefined ? productoActualizado.precio : productoOriginal.precio) || 0,
    descuento: Number(productoActualizado.descuento !== undefined ? productoActualizado.descuento : productoOriginal.descuento) || 0,
    destacado: productoActualizado.destacado !== undefined ? Boolean(productoActualizado.destacado) : productoOriginal.destacado
  };

  productosActuales[indice] = productoFusionado;
  guardarProductos(productosActuales);

  return productoFusionado;
};

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

export const recargarCatalogoInicial = () => {
  guardarProductos(juegosIniciales);
  guardarVersionCatalogo();
  return [...juegosIniciales];
};
