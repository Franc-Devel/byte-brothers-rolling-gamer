const About = () => (
  <section className="epic-box p-4 p-md-5">
    <span className="epic-subheading">Equipo</span>
    <h1 className="epic-heading h2">Rolling Gamer</h1>
    <p className="text-secondary mb-4">Proyecto educativo de e-commerce gamer construido con React, Bootstrap, rutas protegidas, persistencia local y roles de usuario.</p>
    <div className="row g-3">
      {["Francisco Delgado - Team Leader", "Franco Trivino - Scrum Master"].map((p) => <div className="col-md-6" key={p}><div className="epic-specs-col">{p}</div></div>)}
    </div>
  </section>
);

export default About;
