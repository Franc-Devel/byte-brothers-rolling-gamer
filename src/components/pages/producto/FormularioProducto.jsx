import { useState } from "react";
import { Alert, Badge, Button, Card, Form, Modal, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProductos } from "../../../context/ProductosContext.jsx";

const CATEGORIAS = [
  "Acción",
  "Disparos",
  "Carreras",
  "Estrategia",
  "Simulación",
];

const base = {
  nombre: "",
  categoria: "Acción",
  precio: 0,
  descuento: 0,
  desarrollador: "",
  editor: "",
  lanzamiento: "",
  imagen: "",
  galeria: "",
  resumen: "",
  descripcion: "",
  req_min_so: "",
  req_min_cpu: "",
  req_min_ram: "",
  req_min_gpu: "",
  req_min_disco: "",
  req_rec_so: "",
  req_rec_cpu: "",
  req_rec_ram: "",
  req_rec_gpu: "",
  req_rec_disco: "",
};

const mapearJuegoAForm = (juego) => {
  if (!juego) return base;
  return {
    ...base,
    ...juego,
    nombre: juego.nombre || juego.titulo || "",
    categoria: juego.categoria || juego.genero || "Acción",
    precio: juego.precio ?? 0,
    descuento: juego.descuento ?? 0,
    desarrollador: juego.desarrollador || juego.estudio || "",
    editor: juego.editor || "",
    lanzamiento: juego.lanzamiento || "",
    imagen: juego.imagen || juego.portada || "",
    galeria: Array.isArray(juego.galeria) ? juego.galeria.join(", ") : (juego.galeria || ""),
    resumen: juego.resumen || "",
    descripcion: juego.descripcion || "",
    req_min_so: juego.requisitos?.minimos?.so || juego.req_min_so || "",
    req_min_cpu: juego.requisitos?.minimos?.cpu || juego.req_min_cpu || "",
    req_min_ram: juego.requisitos?.minimos?.ram || juego.req_min_ram || "",
    req_min_gpu: juego.requisitos?.minimos?.gpu || juego.req_min_gpu || "",
    req_min_disco: juego.requisitos?.minimos?.disco || juego.req_min_disco || "",
    req_rec_so: juego.requisitos?.recomendados?.so || juego.req_rec_so || "",
    req_rec_cpu: juego.requisitos?.recomendados?.cpu || juego.req_rec_cpu || "",
    req_rec_ram: juego.requisitos?.recomendados?.ram || juego.req_rec_ram || "",
    req_rec_gpu: juego.requisitos?.recomendados?.gpu || juego.req_rec_gpu || "",
    req_rec_disco: juego.requisitos?.recomendados?.disco || juego.req_rec_disco || "",
  };
};

const FormularioProducto = ({
  titulo: tituloProp,
  crearProducto: crearProp,
  modificarProducto: modProp,
  buscarProducto: buscarProp,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productosCtx = useProductos();

  const buscar = buscarProp || productosCtx?.buscarProducto;
  const crear = crearProp || productosCtx?.crearProducto;
  const modificar = modProp || productosCtx?.modificarProducto;

  const editando = Boolean(id);
  const juegoExistente = editando && buscar ? buscar(id) : null;
  const idInvalido = editando && !juegoExistente;

  const [form, setForm] = useState(() => {
    if (editando && juegoExistente) {
      return mapearJuegoAForm(juegoExistente);
    }
    return base;
  });

  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
  const [idPrevio, setIdPrevio] = useState(id);

  if (id !== idPrevio) {
    setIdPrevio(id);
    setForm(editando && juegoExistente ? mapearJuegoAForm(juegoExistente) : base);
    setErrores({});
  }

  const esFormularioModificado = () => {
    const inicial = editando && juegoExistente ? mapearJuegoAForm(juegoExistente) : base;
    return Object.keys(base).some((k) => String(form[k] ?? "") !== String(inicial[k] ?? ""));
  };

  const manejarCancelar = (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (esFormularioModificado()) {
      setMostrarModalCancelar(true);
    } else {
      navigate("/admin");
    }
  };

  const tituloPagina = tituloProp || (editando ? "Editar videojuego" : "Crear videojuego");

  if (idInvalido) {
    return (
      <section className="epic-box p-5 text-center my-4 shadow">
        <i className="bi bi-exclamation-triangle display-4 text-warning mb-3 d-block" />
        <h1 className="epic-heading h3 mb-2">Videojuego no encontrado</h1>
        <p className="text-secondary mb-4">
          No se encontró ningún videojuego en el catálogo con el identificador <code>{id}</code>.
        </p>
        <Button as={Link} to="/admin" className="btn-epic-primary">
          <i className="bi bi-arrow-left me-2" />Volver al panel administrativo
        </Button>
      </section>
    );
  }

  const validarFormulario = () => {
    const err = {};
    const nombreLimpio = String(form.nombre || "").trim();
    if (!nombreLimpio) {
      err.nombre = "El título del videojuego es obligatorio.";
    } else if (nombreLimpio.length < 2) {
      err.nombre = "El título debe contener al menos 2 caracteres.";
    } else if (nombreLimpio.length > 70) {
      err.nombre = "El título no puede superar los 70 caracteres.";
    }

    const desarrolladorLimpio = String(form.desarrollador || "").trim();
    if (!desarrolladorLimpio) {
      err.desarrollador = "El estudio o desarrollador es obligatorio.";
    } else if (desarrolladorLimpio.length < 2) {
      err.desarrollador = "El desarrollador debe tener al menos 2 caracteres.";
    } else if (desarrolladorLimpio.length > 60) {
      err.desarrollador = "El desarrollador no puede superar los 60 caracteres.";
    }

    const numPrecio = Number(form.precio);
    if (isNaN(numPrecio) || form.precio === "" || numPrecio < 50) {
      err.precio = "El precio debe ser un monto numérico mayor o igual a $50 ARS.";
    } else if (numPrecio > 9999999) {
      err.precio = "El precio no puede exceder los $9.999.999 ARS.";
    }

    const numDescuento = Number(form.descuento);
    if (isNaN(numDescuento) || numDescuento < 0 || numDescuento > 90) {
      err.descuento = "El porcentaje de descuento debe estar comprendido entre 0 y 90%.";
    }

    const imgLimpia = String(form.imagen || "").trim();
    if (!imgLimpia) {
      err.imagen = "La URL de la imagen de portada es obligatoria.";
    } else if (!/^https?:\/\/.+/i.test(imgLimpia)) {
      err.imagen = "Ingresa una URL válida que comience con http:// o https://.";
    } else if (imgLimpia.length > 300) {
      err.imagen = "La URL no puede superar los 300 caracteres.";
    }

    const resumenLimpio = String(form.resumen || "").trim();
    if (!resumenLimpio) {
      err.resumen = "El resumen del videojuego es obligatorio.";
    } else if (resumenLimpio.length < 10) {
      err.resumen = "El resumen debe tener como mínimo 10 caracteres.";
    } else if (resumenLimpio.length > 150) {
      err.resumen = "El resumen no puede superar los 150 caracteres.";
    }

    const descLimpia = String(form.descripcion || "").trim();
    if (!descLimpia) {
      err.descripcion = "La descripción detallada es obligatoria.";
    } else if (descLimpia.length < 20) {
      err.descripcion = "La descripción debe tener como mínimo 20 caracteres.";
    } else if (descLimpia.length > 1500) {
      err.descripcion = "La descripción no puede superar los 1500 caracteres.";
    }

    return err;
  };

  const set = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => {
        const copia = { ...prev };
        delete copia[name];
        return copia;
      });
    }
  };

  const enviar = (e) => {
    e.preventDefault();
    const fallas = validarFormulario();
    if (Object.keys(fallas).length > 0) {
      setErrores(fallas);
      setAlerta({
        tipo: "danger",
        mensaje: "Por favor corrige los campos marcados en rojo antes de guardar.",
      });
      return;
    }

    setGuardando(true);
    const galeriaArray = typeof form.galeria === "string"
      ? form.galeria
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean)
      : (Array.isArray(form.galeria) ? form.galeria : []);

    const requisitosNormalizados = {
      minimos: {
        so: form.req_min_so?.trim() || "Windows 10 64-bit",
        cpu: form.req_min_cpu?.trim() || "Intel Core i5 / AMD Ryzen 3",
        ram: form.req_min_ram?.trim() || "8 GB RAM",
        gpu: form.req_min_gpu?.trim() || "NVIDIA GTX 1050 / AMD Radeon RX 560",
        disco: form.req_min_disco?.trim() || "50 GB de espacio libre",
      },
      recomendados: {
        so: form.req_rec_so?.trim() || "Windows 10/11 64-bit",
        cpu: form.req_rec_cpu?.trim() || "Intel Core i7 / AMD Ryzen 5",
        ram: form.req_rec_ram?.trim() || "16 GB RAM",
        gpu: form.req_rec_gpu?.trim() || "NVIDIA RTX 2060 / AMD Radeon RX 5700",
        disco: form.req_rec_disco?.trim() || "50 GB SSD",
      },
    };

    const productoListo = {
      ...(editando && juegoExistente ? juegoExistente : {}),
      id: editando && juegoExistente ? juegoExistente.id : Date.now().toString(),
      nombre: String(form.nombre || "").trim(),
      titulo: String(form.nombre || "").trim(),
      categoria: form.categoria,
      genero: form.categoria,
      precio: Number(form.precio),
      descuento: Number(form.descuento || 0),
      desarrollador: String(form.desarrollador || "").trim(),
      estudio: String(form.desarrollador || "").trim(),
      editor: String(form.editor || "").trim(),
      lanzamiento: form.lanzamiento || "",
      imagen: String(form.imagen || "").trim(),
      portada: String(form.imagen || "").trim(),
      galeria: galeriaArray,
      resumen: String(form.resumen || "").trim(),
      descripcion: String(form.descripcion || "").trim(),
      requisitos: requisitosNormalizados,
      resenas: editando && juegoExistente?.resenas ? juegoExistente.resenas : [],
    };

    setAlerta({
      tipo: "success",
      mensaje: editando
        ? "¡Videojuego modificado exitosamente! Redirigiendo al panel..."
        : "¡Videojuego registrado exitosamente! Redirigiendo al panel...",
    });

    setTimeout(() => {
      if (editando && modificar) {
        modificar(productoListo);
      } else if (crear) {
        crear(productoListo);
      }
      navigate("/admin");
    }, 600);
  };

  return (
    <section className="epic-box p-3 p-sm-4 shadow-sm">
      <button
        type="button"
        onClick={manejarCancelar}
        aria-label="Volver al panel de administración"
        className="btn btn-link p-0 text-secondary text-decoration-none small d-inline-flex align-items-center mb-3"
      >
        <i className="bi bi-arrow-left me-1" />Volver al panel
      </button>
      <h1 className="epic-heading h3 mb-3">{tituloPagina}</h1>

      {alerta && (
        <Alert
          variant={alerta.tipo}
          dismissible
          onClose={() => setAlerta(null)}
          className="d-flex align-items-center gap-2 mb-4"
        >
          <i className={`bi ${alerta.tipo === "success" ? "bi-check-circle-fill" : "bi-exclamation-octagon-fill"} fs-5`} />
          <span>{alerta.mensaje}</span>
        </Alert>
      )}

      <Form onSubmit={enviar} noValidate className="row g-3">
        {/* Información básica */}
        <Form.Group className="col-md-6" controlId="formTituloVideojuego">
          <Form.Label className="small text-secondary fw-semibold">Título del videojuego *</Form.Label>
          <Form.Control
            name="nombre"
            className="epic-input"
            placeholder="Ej. Cyberpunk 2077: Phantom Liberty"
            value={form.nombre || ""}
            onChange={set}
            isInvalid={Boolean(errores.nombre)}
            required
            minLength={2}
            maxLength={70}
          />
          <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="col-md-6" controlId="formCategoriaVideojuego">
          <Form.Label className="small text-secondary fw-semibold">Categoría / Género *</Form.Label>
          <Form.Select
            name="categoria"
            className="epic-input"
            value={form.categoria || "Acción"}
            onChange={set}
            required
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat} className="bg-dark text-light">
                {cat}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="col-md-4" controlId="formDesarrollador">
          <Form.Label className="small text-secondary fw-semibold">Estudio / Desarrollador *</Form.Label>
          <Form.Control
            name="desarrollador"
            className="epic-input"
            placeholder="Ej. CD Projekt Red"
            value={form.desarrollador || ""}
            onChange={set}
            isInvalid={Boolean(errores.desarrollador)}
            required
            minLength={2}
            maxLength={60}
          />
          <Form.Control.Feedback type="invalid">{errores.desarrollador}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="col-md-4" controlId="formEditor">
          <Form.Label className="small text-secondary fw-semibold">Editor / Distribuidor</Form.Label>
          <Form.Control
            name="editor"
            className="epic-input"
            placeholder="Ej. CD Projekt"
            value={form.editor || ""}
            onChange={set}
            maxLength={60}
          />
        </Form.Group>

        <Form.Group className="col-md-4" controlId="formLanzamiento">
          <Form.Label className="small text-secondary fw-semibold">Fecha de lanzamiento</Form.Label>
          <Form.Control
            name="lanzamiento"
            type="date"
            className="epic-input"
            value={form.lanzamiento || ""}
            onChange={set}
          />
        </Form.Group>

        {/* Precios y descuentos */}
        <Form.Group className="col-md-6" controlId="formPrecio">
          <Form.Label className="small text-secondary fw-semibold">Precio (ARS) * (mínimo $50)</Form.Label>
          <Form.Control
            name="precio"
            type="number"
            min="50"
            max="9999999"
            step="1"
            className="epic-input"
            placeholder="Ej. 15000"
            value={form.precio}
            onChange={set}
            isInvalid={Boolean(errores.precio)}
            required
          />
          <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="col-md-6" controlId="formDescuento">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <Form.Label className="small text-secondary fw-semibold mb-0">Descuento (%) (0 a 90)</Form.Label>
            {Number(form.descuento) > 0 && (
              <Badge bg="success" className="small">
                Final: ${Math.round(Number(form.precio || 0) * (1 - Math.min(90, Number(form.descuento)) / 100)).toLocaleString("es-AR")} ARS
              </Badge>
            )}
          </div>
          <Form.Control
            name="descuento"
            type="number"
            min="0"
            max="90"
            className="epic-input"
            placeholder="0 a 90"
            value={form.descuento}
            onChange={set}
            isInvalid={Boolean(errores.descuento)}
          />
          <Form.Control.Feedback type="invalid">{errores.descuento}</Form.Control.Feedback>
        </Form.Group>

        {/* Multimedia */}
        <Form.Group className="col-md-8" controlId="formImagenPortada">
          <Form.Label className="small text-secondary fw-semibold">URL de imagen de portada *</Form.Label>
          <Form.Control
            name="imagen"
            type="url"
            className="epic-input mb-2"
            placeholder="https://images.unsplash.com/..."
            value={form.imagen || ""}
            onChange={set}
            isInvalid={Boolean(errores.imagen)}
            required
            maxLength={300}
          />
          <Form.Control.Feedback type="invalid">{errores.imagen}</Form.Control.Feedback>
          <Form.Label className="small text-secondary fw-semibold">Galería de capturas (URLs separadas por comas)</Form.Label>
          <Form.Control
            name="galeria"
            className="epic-input"
            placeholder="https://ejemplo.com/foto1.jpg, https://ejemplo.com/foto2.jpg"
            value={form.galeria || ""}
            onChange={set}
            maxLength={800}
          />
          <small className="text-secondary opacity-75">Opcional. Se normalizarán automáticamente al guardar.</small>
        </Form.Group>

        <Form.Group className="col-md-4">
          <Form.Label className="small text-secondary fw-semibold d-block">Vista previa de portada</Form.Label>
          <div className="epic-box p-1 text-center bg-black bg-opacity-50 border border-secondary border-opacity-25 rounded" style={{ minHeight: 120 }}>
            <img
              src={form.imagen || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"}
              alt="Previsualización de portada"
              className="w-100 rounded object-fit-cover shadow-sm"
              style={{ height: 115 }}
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"; }}
            />
          </div>
        </Form.Group>

        {/* Descripciones con validaciones de longitud */}
        <Form.Group className="col-12" controlId="formResumen">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <Form.Label className="small text-secondary fw-semibold mb-0">Resumen / Descripción corta * (10 a 150 caracteres)</Form.Label>
            <small className={`small ${String(form.resumen || "").trim().length >= 10 ? "text-secondary" : "text-warning"}`}>
              {String(form.resumen || "").trim().length} / 150 (mín. 10)
            </small>
          </div>
          <Form.Control
            name="resumen"
            className="epic-input"
            placeholder="Ej. Aventura de espionaje y supervivencia en el distrito de Dogtown."
            value={form.resumen || ""}
            onChange={set}
            isInvalid={Boolean(errores.resumen)}
            required
            minLength={10}
            maxLength={150}
          />
          <Form.Control.Feedback type="invalid">{errores.resumen}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="col-12" controlId="formDescripcionDetallada">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <Form.Label className="small text-secondary fw-semibold mb-0">Descripción detallada del juego * (20 a 1500 caracteres)</Form.Label>
            <small className={`small ${String(form.descripcion || "").trim().length >= 20 ? "text-secondary" : "text-warning"}`}>
              {String(form.descripcion || "").trim().length} / 1500 (mín. 20)
            </small>
          </div>
          <Form.Control
            as="textarea"
            rows={4}
            name="descripcion"
            className="epic-input"
            placeholder="Argumento principal, mecánicas de juego, ambientación..."
            value={form.descripcion || ""}
            onChange={set}
            isInvalid={Boolean(errores.descripcion)}
            required
            minLength={20}
            maxLength={1500}
          />
          <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
        </Form.Group>

        {/* Requisitos de Sistema */}
        <div className="col-12 mt-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-cpu text-warning fs-5" />
            <h2 className="h5 mb-0 text-light fw-bold">Requisitos de Sistema para PC</h2>
          </div>
          <p className="text-secondary small mb-3">
            Completa las especificaciones técnicas mínimas y recomendadas para guiar a los jugadores.
          </p>

          <div className="row g-3">
            {/* Requisitos Mínimos */}
            <div className="col-12 col-lg-6">
              <Card className="bg-black bg-opacity-40 border border-secondary border-opacity-25 h-100">
                <Card.Header className="bg-transparent border-secondary border-opacity-25 py-2">
                  <span className="badge bg-secondary bg-opacity-50 text-light me-2">Mínimos</span>
                  <small className="text-secondary">Configuración básica</small>
                </Card.Header>
                <Card.Body className="d-flex flex-column gap-2 p-3">
                  <div>
                    <Form.Label htmlFor="req_min_so" className="small text-secondary fw-semibold mb-1">Sistema Operativo</Form.Label>
                    <Form.Control
                      id="req_min_so"
                      name="req_min_so"
                      className="epic-input"
                      placeholder="Ej. Windows 10 64-bit"
                      value={form.req_min_so || ""}
                      onChange={set}
                      maxLength={60}
                    />
                  </div>
                  <div>
                    <Form.Label htmlFor="req_min_cpu" className="small text-secondary fw-semibold mb-1">Procesador (CPU)</Form.Label>
                    <Form.Control
                      id="req_min_cpu"
                      name="req_min_cpu"
                      className="epic-input"
                      placeholder="Ej. Intel Core i5-3570K / AMD FX-8310"
                      value={form.req_min_cpu || ""}
                      onChange={set}
                      maxLength={80}
                    />
                  </div>
                  <div>
                    <Form.Label htmlFor="req_min_ram" className="small text-secondary fw-semibold mb-1">Memoria RAM</Form.Label>
                    <Form.Control
                      id="req_min_ram"
                      name="req_min_ram"
                      className="epic-input"
                      placeholder="Ej. 8 GB RAM"
                      value={form.req_min_ram || ""}
                      onChange={set}
                      maxLength={40}
                    />
                  </div>
                  <div>
                    <Form.Label htmlFor="req_min_gpu" className="small text-secondary fw-semibold mb-1">Tarjeta Gráfica (GPU)</Form.Label>
                    <Form.Control
                      id="req_min_gpu"
                      name="req_min_gpu"
                      className="epic-input"
                      placeholder="Ej. NVIDIA GeForce GTX 780 3GB / AMD Radeon RX 470"
                      value={form.req_min_gpu || ""}
                      onChange={set}
                      maxLength={80}
                    />
                  </div>
                  <div>
                    <Form.Label htmlFor="req_min_disco" className="small text-secondary fw-semibold mb-1">Almacenamiento</Form.Label>
                    <Form.Control
                      id="req_min_disco"
                      name="req_min_disco"
                      className="epic-input"
                      placeholder="Ej. 70 GB de espacio disponible"
                      value={form.req_min_disco || ""}
                      onChange={set}
                      maxLength={40}
                    />
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Requisitos Recomendados */}
            <div className="col-12 col-lg-6">
              <Card className="bg-black bg-opacity-40 border border-secondary border-opacity-25 h-100">
                <Card.Header className="bg-transparent border-secondary border-opacity-25 py-2">
                  <span className="badge bg-warning bg-opacity-75 text-dark fw-bold me-2">Recomendados</span>
                  <small className="text-secondary">Rendimiento óptimo</small>
                </Card.Header>
                <Card.Body className="d-flex flex-column gap-2 p-3">
                  <div>
                    <Form.Label htmlFor="req_rec_so" className="small text-secondary fw-semibold mb-1">Sistema Operativo</Form.Label>
                    <Form.Control
                      id="req_rec_so"
                      name="req_rec_so"
                      className="epic-input"
                      placeholder="Ej. Windows 10/11 64-bit"
                      value={form.req_rec_so || ""}
                      onChange={set}
                      maxLength={60}
                    />
                  </div>
                  <div>
                    <Form.Label htmlFor="req_rec_cpu" className="small text-secondary fw-semibold mb-1">Procesador (CPU)</Form.Label>
                    <Form.Control
                      id="req_rec_cpu"
                      name="req_rec_cpu"
                      className="epic-input"
                      placeholder="Ej. Intel Core i7-4790 / AMD Ryzen 3 3200G"
                      value={form.req_rec_cpu || ""}
                      onChange={set}
                      maxLength={80}
                    />
                  </div>
                  <div>
                    <Form.Label htmlFor="req_rec_ram" className="small text-secondary fw-semibold mb-1">Memoria RAM</Form.Label>
                    <Form.Control
                      id="req_rec_ram"
                      name="req_rec_ram"
                      className="epic-input"
                      placeholder="Ej. 16 GB RAM"
                      value={form.req_rec_ram || ""}
                      onChange={set}
                      maxLength={40}
                    />
                  </div>
                  <div>
                    <Form.Label htmlFor="req_rec_gpu" className="small text-secondary fw-semibold mb-1">Tarjeta Gráfica (GPU)</Form.Label>
                    <Form.Control
                      id="req_rec_gpu"
                      name="req_rec_gpu"
                      className="epic-input"
                      placeholder="Ej. NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 590"
                      value={form.req_rec_gpu || ""}
                      onChange={set}
                      maxLength={80}
                    />
                  </div>
                  <div>
                    <Form.Label htmlFor="req_rec_disco" className="small text-secondary fw-semibold mb-1">Almacenamiento</Form.Label>
                    <Form.Control
                      id="req_rec_disco"
                      name="req_rec_disco"
                      className="epic-input"
                      placeholder="Ej. 70 GB SSD"
                      value={form.req_rec_disco || ""}
                      onChange={set}
                      maxLength={40}
                    />
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>

        <div className="col-12 d-flex flex-column flex-sm-row gap-2 pt-3 border-top border-secondary border-opacity-25 mt-4">
          <Button
            type="submit"
            className="btn-epic-primary d-inline-flex justify-content-center align-items-center gap-2 py-2 px-4"
            disabled={guardando}
          >
            {guardando ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span>Guardando videojuego...</span>
              </>
            ) : (
              <>
                <i className="bi bi-check-lg fs-5" />
                <span className="fw-semibold">Guardar videojuego</span>
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline-secondary"
            className="d-inline-flex justify-content-center align-items-center py-2 px-4"
            disabled={guardando}
            onClick={manejarCancelar}
          >
            Cancelar
          </Button>
        </div>
      </Form>

      <Modal
        show={mostrarModalCancelar}
        onHide={() => setMostrarModalCancelar(false)}
        centered
        contentClassName="bg-dark text-light border border-secondary border-opacity-25 shadow-lg"
      >
        <Modal.Header closeButton closeVariant="white" className="border-secondary border-opacity-25">
          <Modal.Title className="h5 d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle text-warning" />
            ¿Descartar cambios?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-secondary small">
          Tienes modificaciones sin guardar en el formulario. Si sales ahora, los datos introducidos se perderán.
        </Modal.Body>
        <Modal.Footer className="border-secondary border-opacity-25">
          <Button variant="outline-secondary" size="sm" onClick={() => setMostrarModalCancelar(false)}>
            Continuar editando
          </Button>
          <Button variant="danger" size="sm" onClick={() => navigate("/admin")}>
            Descartar y volver
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default FormularioProducto;
