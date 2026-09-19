import { useState } from "react";
import { Alert, Button, Card, Form, InputGroup, Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const DEMOS = {
  admin: { email: "admin@rollinggames.com", password: "admin123", label: "Administrador" },
  usuario: { email: "user@rollinggames.com", password: "user123", label: "Usuario Gamer" },
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate(), location = useLocation();
  const destino = location.state?.from?.pathname || "/";
  const [modo, setModo] = useState(() => (location.state?.tab === "registro" ? "registro" : "login"));
  const [alerta, setAlerta] = useState(null);
  const [verPass, setVerPass] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", password: "", repetir: "" });

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const entrar = (u) => navigate(u?.rol === "admin" && destino === "/" ? "/admin" : destino, { replace: true });
  const cambiarModo = (m) => { setModo(m); setAlerta(null); };

  const cargarDemo = (tipo) => {
    const cred = DEMOS[tipo];
    if (!cred) return;
    setModo("login");
    setForm((prev) => ({ ...prev, email: cred.email, password: cred.password }));
    setAlerta({ variant: "info", texto: `Credenciales de ${cred.label} cargadas. Presiona "Entrar" para continuar.` });
  };

  const validarRegistro = () => {
    if (form.nombre.trim().length < 3) return "El nombre debe contener al menos 3 caracteres.";
    if (!EMAIL_REGEX.test(form.email.trim())) return "Ingresa un correo electrónico con formato válido.";
    if (form.password.length < 6 || form.password.length > 20) return "La contraseña debe tener entre 6 y 20 caracteres.";
    if (form.password !== form.repetir) return "Las contraseñas no coinciden.";
    return null;
  };

  const enviar = (e) => {
    e.preventDefault();
    setAlerta(null);
    if (modo === "login") {
      if (form.password.length < 6 || form.password.length > 20) {
        setAlerta({ variant: "warning", texto: "La contraseña debe tener entre 6 y 20 caracteres." });
        return;
      }
      const r = login(form.email.trim(), form.password);
      r.success ? entrar(r.usuario) : setAlerta({ variant: "danger", texto: r.mensaje || "Credenciales incorrectas." });
      return;
    }
    const err = validarRegistro();
    if (err) return setAlerta({ variant: "warning", texto: err });
    const r = register({ nombre: form.nombre.trim(), email: form.email.trim(), password: form.password });
    if (r.success) {
      setAlerta({ variant: "success", texto: "¡Cuenta creada exitosamente! Ingresando a la plataforma..." });
      setTimeout(() => entrar(r.usuario), 800);
    } else {
      setAlerta({ variant: "danger", texto: r.mensaje || "No fue posible registrar la cuenta." });
    }
  };

  return (
    <div className="row justify-content-center py-4 py-md-5 px-2 px-sm-0">
      <div className="col-12 col-sm-10 col-md-8 col-lg-5">
        <Card className="epic-box p-3 p-sm-4 text-light shadow">
          <h1 className="epic-heading h3 text-center mb-3">{modo === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>
          <Nav variant="pills" fill className="bg-black rounded p-1 mb-3">
            {["login", "registro"].map((m) => (
              <Nav.Item key={m}>
                <Nav.Link active={modo === m} onClick={() => cambiarModo(m)} className="text-capitalize py-2">
                  {m === "login" ? "Ingresar" : "Registro"}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {alerta && <Alert variant={alerta.variant} className="py-2 small text-center">{alerta.texto}</Alert>}

          <Form onSubmit={enviar}>
            {modo === "registro" && (
              <Form.Control
                name="nombre"
                className="epic-input mb-3"
                placeholder="Nombre o alias (mínimo 3 caracteres)"
                value={form.nombre}
                onChange={set}
                required
                minLength={3}
              />
            )}
            <Form.Control
              name="email"
              type="email"
              className="epic-input mb-3"
              placeholder="Email (ej. usuario@correo.com)"
              value={form.email}
              onChange={set}
              required
            />
            <InputGroup className="mb-3">
              <Form.Control
                name="password"
                type={verPass ? "text" : "password"}
                className="epic-input border-end-0"
                placeholder="Contraseña (6 a 20 caracteres)"
                value={form.password}
                onChange={set}
                required
                minLength={6}
                maxLength={20}
              />
              <Button
                variant="outline-secondary"
                type="button"
                className="bg-transparent text-secondary border-start-0"
                onClick={() => setVerPass(!verPass)}
                title={verPass ? "Ocultar contraseña" : "Ver contraseña"}
              >
                <i className={`bi ${verPass ? "bi-eye-slash" : "bi-eye"}`} />
              </Button>
            </InputGroup>
            {modo === "registro" && (
              <InputGroup className="mb-3">
                <Form.Control
                  name="repetir"
                  type={verRepetir ? "text" : "password"}
                  className="epic-input border-end-0"
                  placeholder="Repetir contraseña (6 a 20 caracteres)"
                  value={form.repetir}
                  onChange={set}
                  required
                  minLength={6}
                  maxLength={20}
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  className="bg-transparent text-secondary border-start-0"
                  onClick={() => setVerRepetir(!verRepetir)}
                  title={verRepetir ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  <i className={`bi ${verRepetir ? "bi-eye-slash" : "bi-eye"}`} />
                </Button>
              </InputGroup>
            )}
            <Button type="submit" className="btn-epic-primary w-100 py-2">
              {modo === "login" ? "Entrar" : "Registrarme"}
            </Button>
          </Form>

          <div className="d-grid gap-2 mt-3 pt-2 border-top border-secondary border-opacity-25">
            <div className="d-flex gap-2">
              <Button variant="outline-warning" size="sm" className="w-50" onClick={() => cargarDemo("admin")}>
                Demo Admin
              </Button>
              <Button variant="outline-info" size="sm" className="w-50" onClick={() => cargarDemo("usuario")}>
                Demo Usuario
              </Button>
            </div>
          </div>

          <Link to="/" className="text-secondary small text-center mt-3 text-decoration-none">
            <i className="bi bi-arrow-left me-1" />Volver al catálogo
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Login;
