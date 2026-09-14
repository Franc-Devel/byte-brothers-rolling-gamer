import { useState } from "react";
import { Alert, Button, Card, Form, Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const { login, register, loginRapido } = useAuth();
  const navigate = useNavigate(), location = useLocation();
  const destino = location.state?.from?.pathname || "/";
  const [modo, setModo] = useState("login"), [msg, setMsg] = useState("");
  const [form, setForm] = useState({ nombre: "", email: "", password: "", repetir: "" });
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const entrar = (u) => navigate(u?.rol === "admin" && destino === "/" ? "/admin" : destino, { replace: true });

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
          <h1 className="epic-heading h3 text-center mb-3">{modo === "login" ? "Iniciar sesion" : "Crear cuenta"}</h1>
          <Nav variant="pills" fill className="bg-black rounded p-1 mb-3">
            {["login", "registro"].map((m) => <Nav.Item key={m}><Nav.Link active={modo === m} onClick={() => { setModo(m); setMsg(""); }}>{m}</Nav.Link></Nav.Item>)}
          </Nav>
          {msg && <Alert variant="danger" className="py-2">{msg}</Alert>}
          <Form onSubmit={enviar}>
            {modo === "registro" && <Form.Control name="nombre" className="epic-input mb-3" placeholder="Nombre o alias" value={form.nombre} onChange={set} required />}
            <Form.Control name="email" type="email" className="epic-input mb-3" placeholder="Email" value={form.email} onChange={set} required />
            <Form.Control name="password" type="password" className="epic-input mb-3" placeholder="Contrasena" value={form.password} onChange={set} required minLength={6} />
            {modo === "registro" && <Form.Control name="repetir" type="password" className="epic-input mb-3" placeholder="Repetir contrasena" value={form.repetir} onChange={set} required />}
            <Button type="submit" className="btn-epic-primary w-100">{modo === "login" ? "Entrar" : "Registrarme"}</Button>
          </Form>
          <div className="d-grid gap-2 mt-3">
            <Button variant="outline-warning" onClick={() => entrar(loginRapido("admin"))}>Demo admin</Button>
            <Button variant="outline-info" onClick={() => entrar(loginRapido("usuario"))}>Demo usuario</Button>
          </div>
          <Link to="/" className="text-secondary small text-center mt-3">Volver al catalogo</Link>
        </Card>
      </div>
    </div>
  );
};

export default Login;
