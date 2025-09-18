import { useEffect, useState } from "react";

function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-section" data-aos="fade-up">
          <h3>AETERNUM.</h3>
          <p>Tu espacio digital para explorar mundos literarios y expandir tu conocimiento.</p>
        </div>
        <div className="footer-section" data-aos="fade-up" data-aos-delay="100">
          <h3>Acerca de</h3>
          <ul>
            <li><a href="#">Equipo</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>
        <div className="footer-section" data-aos="fade-up" data-aos-delay="200">
          <h3>Privacidad</h3>
          <ul>
            <li><a href="politica_privacidad.html">Política de Privacidad</a></li>
            <li><a href="#">Términos de Servicio</a></li>
            <li><a href="#">Ayuda</a></li>
          </ul>
        </div>
        <div className="footer-section" data-aos="fade-up" data-aos-delay="300">
          <h3>Social</h3>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom" >
        <p>&copy; {year} Aeternum. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;