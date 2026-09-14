import { Container } from "react-bootstrap";
import { useUIModal } from "../../context/UIModalContext.jsx";

const Footer = () => {
  const { abrirModal } = useUIModal();
  return (
    <footer className="epic-footer py-4 mt-auto">
      <Container className="d-flex flex-column flex-md-row justify-content-between gap-3 small">
        <div><strong className="text-light">Rolling Gamer</strong><br />Proyecto educativo RollingCode School.</div>
        <div className="d-flex flex-wrap gap-3">
          {["terminos", "privacidad", "reembolsos", "seguridad"].map((t) => (
            <button key={t} className="btn btn-link btn-sm p-0 text-secondary text-decoration-none" onClick={() => abrirModal(t)}>{t}</button>
          ))}
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
