import { Container, Row, Col, Card, Badge } from "react-bootstrap";

const MIEMBROS = [
  {
    nombre: "Francisco Delgado",
    rol: "Team Leader & Full Stack Developer",
    descripcion: "Líder técnico a cargo de la arquitectura general en React, modelado del catálogo, persistencia reactiva en LocalStorage y seguridad de rutas.",
    imagen: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    habilidades: ["Team Leader", "React", "JavaScript", "Arquitectura SPA"]
  },
  {
    nombre: "Franco Triviño",
    rol: "Scrum Master & Frontend Developer",
    descripcion: "Facilitador del marco ágil Scrum, responsable del backlog y sprints en Trello, diseño inspirado en Epic Games Store y experiencia de usuario.",
    imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    habilidades: ["Scrum Master", "Trello Ágil", "CSS3 / Bootstrap", "UI/UX Design"]
  }
];

const TECNOLOGIAS = [
  { nombre: "React 19", desc: "Hooks modernos y componentes reutilizables" },
  { nombre: "React Router", desc: "Enrutamiento SPA dinámico y rutas protegidas" },
  { nombre: "Bootstrap 5", desc: "Sistema de grillas responsive y utilidades CSS" },
  { nombre: "LocalStorage API", desc: "Persistencia completa de catálogo y usuarios" }
];

const About = () => {
  return (
    <Container className="py-4 py-md-5">
      {/* Cabecera institucional */}
      <header className="text-center mb-5">
        <span className="epic-subheading mb-2 d-block text-primary">
          EQUIPO DE DESARROLLO · ROLLINGCODE SCHOOL
        </span>
        <h1 className="display-5 fw-bold text-white mb-3">
          Detrás de Rolling Gamer
        </h1>
        <p className="text-secondary mx-auto mb-0" style={{ maxWidth: "700px" }}>
          Proyecto académico de e-commerce desarrollado por <strong>Francisco Delgado</strong> y <strong>Franco Triviño</strong>, replicando la experiencia y estética de Epic Games Store.
        </p>
      </header>

      {/* Tarjetas del equipo */}
      <section className="mb-5">
        <div className="epic-subheading mb-4 text-center">
          Desarrolladores del Proyecto
        </div>
        <Row className="gy-4 justify-content-center">
          {MIEMBROS.map((m) => (
            <Col md={6} lg={5} key={m.nombre}>
              <Card className="epic-box h-100 p-4 text-center border-0">
                <div className="mx-auto mb-3" style={{ width: "110px", height: "110px" }}>
                  <img
                    src={m.imagen}
                    alt={`Fotografía de ${m.nombre}`}
                    className="w-100 h-100 rounded-circle object-fit-cover border border-2 border-primary"
                  />
                </div>
                <h2 className="h4 text-white fw-bold mb-1">{m.nombre}</h2>
                <div className="small fw-bold text-primary mb-3">{m.rol}</div>
                <p className="small text-secondary mb-4" style={{ lineHeight: "1.6" }}>
                  {m.descripcion}
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-1 mt-auto">
                  {m.habilidades.map((h) => (
                    <Badge key={h} bg="dark" className="border border-secondary text-secondary small">
                      {h}
                    </Badge>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Metodología Ágil y Stack Tecnológico */}
      <Row className="g-4">
        <Col lg={7}>
          <div className="epic-box p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="epic-subheading d-block mb-2 text-warning">
                METODOLOGÍA DE TRABAJO
              </span>
              <h3 className="h4 text-white fw-bold mb-3">Organización Ágil (Scrum & Trello)</h3>
              <p className="small text-secondary mb-3">
                Bajo los roles de <strong>Scrum Master (Franco)</strong> y <strong>Team Leader (Francisco)</strong>, coordinamos sprints iterativos, distribución equitativa de tarjetas por dependencias y revisión continua de código en GitHub.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {["Sprint Planning", "Daily Standups", "Backlog en Trello", "Code Reviews"].map((item) => (
                  <Badge key={item} bg="dark" className="border border-secondary text-secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <a
              href="https://trello.com"
              target="_blank"
              rel="noreferrer"
              className="btn-epic-secondary py-2 px-3 small text-center text-decoration-none"
            >
              <i className="bi bi-kanban me-2"></i> Abrir Tablero de Trello
            </a>
          </div>
        </Col>

        <Col lg={5}>
          <div className="epic-box p-4 h-100">
            <span className="epic-subheading d-block mb-2 text-primary">
              ARQUITECTURA
            </span>
            <h3 className="h4 text-white fw-bold mb-3">Stack Tecnológico</h3>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-3 mb-0">
              {TECNOLOGIAS.map((t) => (
                <li key={t.nombre} className="d-flex align-items-start gap-2">
                  <i className="bi bi-check2-circle text-primary mt-1"></i>
                  <div>
                    <strong className="text-white d-block">{t.nombre}</strong>
                    <span>{t.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
