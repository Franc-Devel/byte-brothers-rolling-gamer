import { useState, useEffect } from "react";
import { Alert, Button, Card, Form, InputGroup, Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const CREDENCIALES_DEMO = {
  admin: { email: "admin@rollinggames.com", password: "admin123", label: "Administrador" },
  usuario: { email: "user@rollinggames.com", password: "user123", label: "Usuario Gamer" },
};

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate(), location = useLocation();
  const destino = location.state?.from?.pathname || "/";
  const [modo, setModo] = useState(() => (location.state?.tab === "registro" ? "registro" : "login"));
  const [msg, setMsg] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", password: "", repetir: "" });

  useEffect(() => {
    if (location.state?.tab === "registro") setModo("registro");
  }, [location.state?.tab]);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const entrar = (u) => navigate(u?.rol === "admin" && destino === "/" ? "/admin" : destino, { replace: true });
  const cambiarModo = (m) => { setModo(m); setMsg(""); };

  const cargarDemo = (tipo) => {
    const cred = CREDENCIALES_DEMO[tipo];
    if (!cred) return;
    setModo("login");
    setForm((prev) => ({ ...prev, email: cred.email, password: cred.password }));
    setMsg(`Credenciales de ${cred.label} cargadas. Presiona "Entrar" para continuar.`);
  };

  const enviar = (e) => {
    e.preventDefault(); setMsg("");
    const r = modo === "login" ? login(form.email, form.password) : form.password !== form.repetir
      ? { success: false, mensaje: "Las contrasenas no coinciden." }
      : register({ nombre: form.nombre, email: form.email, password: form.password });
    r.success ? entrar(r.usuario) : setMsg(r.mensaje);
  };

  return (
    <div className="row justify-content-center py-5">
      <div className="col-md-8 col-lg-5">
        <Card className="epic-box p-4 text-light">
          <h1 className="epic-heading h3 text-center mb-3">{modo === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>
          <Nav variant="pills" fill className="bg-black rounded p-1 mb-3">
            {["login", "registro"].map((m) => (
              <Nav.Item key={m}>
                <Nav.Link active={modo === m} onClick={() => cambiarModo(m)} className="text-capitalize">
                  {m === "login" ? "Ingresar" : "Registro"}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          {msg && <Alert variant="info" className="py-2">{msg}</Alert>}
          <Form onSubmit={enviar}>
            {modo === "registro" && (
              <Form.Control name="nombre" className="epic-input mb-3" placeholder="Nombre o alias" value={form.nombre} onChange={set} required />
            )}
            <Form.Control name="email" type="email" className="epic-input mb-3" placeholder="Email" value={form.email} onChange={set} required />
            <InputGroup className="mb-3">
              <Form.Control
                name="password"
                type={verPass ? "text" : "password"}
                className="epic-input border-end-0"
                placeholder="Contraseña"
                value={form.password}
                onChange={set}
                required
                minLength={6}
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
                  placeholder="Repetir contraseña"
                  value={form.repetir}
                  onChange={set}
                  required
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
            <Button type="submit" className="btn-epic-primary w-100">{modo === "login" ? "Entrar" : "Registrarme"}</Button>
          </Form>
          <div className="d-grid gap-2 mt-3">
            <Button variant="outline-warning" onClick={() => cargarDemo("admin")}>Demo admin</Button>
            <Button variant="outline-info" onClick={() => cargarDemo("usuario")}>Demo usuario</Button>
          </div>
          <Link to="/" className="text-secondary small text-center mt-3">Volver al catálogo</Link>
        </Card>
      </div>
    </div>
  );
};

export default Login;
