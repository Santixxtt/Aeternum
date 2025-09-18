function Features() {
  const items = [
    { title: "Variedad de Libros", desc: "Explora un amplio catálogo que incluye novelas, ensayos, poesía y mucho más." },
    { title: "Préstamos Flexibles", desc: "Disfruta de tus lecturas al ritmo que prefieras con plazos ajustables." },
    { title: "Reseñas de la Comunidad", desc: "Lee las opiniones de otros lectores y comparte tus experiencias." },
    { title: "Listas y Favoritos", desc: "Organiza tus libros deseados y guarda tus lecturas preferidas." },
    { title: "Guías de Lectura", desc: "Descubre nuevas lecturas a través de nuestras guías temáticas." },
    { title: "Recomendaciones Personalizadas", desc: "Recibe sugerencias basadas en tus intereses e historial." }
  ];

  return (
    <section className="features">
      <h2 data-aos="fade-down"><span>*</span><br />¿Qué ofrece nuestra página?</h2>
      <p data-aos="fade-up">
        Disfruta de préstamos digitales, crea tu lista de deseos, deja reseñas y recibe recomendaciones personalizadas.
      </p>
      <div className="features-grid">
        {items.map((item, index) => (
          <div key={index} className="feature-item" data-aos="fade-up" data-aos-delay={index * 100}>
            <h3><span className="span-box">*</span><br />{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
