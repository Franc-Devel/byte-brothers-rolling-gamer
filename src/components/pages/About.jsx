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

const About = () => {
  return (
    <Container className="py-4 py-md-5">
      <header className="text-center mb-5">
        <span className="epic-subheading mb-2 d-block text-primary">
          EQUIPO DE DESARROLLO · ROLLINGCODE SCHOOL
        </span>
        <h1 className="display-5 fw-bold text-white mb-3">
          Detrás de Rolling Gamer
        </h1>
        <p className="text-secondary mx-auto mb-0" style={{ maxWidth: "700px" }}>
          Proyecto de e-commerce gamer desarrollado por <strong>Francisco Delgado</strong> y <strong>Franco Triviño</strong>, replicando el catálogo y la experiencia visual de Epic Games Store.
        </p>
      </header>

      <section className="mb-4">
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
    </Container>
  );
};

export default About;
