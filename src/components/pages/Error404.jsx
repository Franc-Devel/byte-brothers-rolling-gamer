import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Error404 = () => (
  <section className="py-5 text-center">
    <h1 className="epic-heading display-4">404</h1>
    <p className="text-secondary">La ruta solicitada no existe en Rolling Gamer.</p>
    <Button as={Link} to="/" className="btn-epic-primary">Volver al catalogo</Button>
  </section>
);

export default Error404;
