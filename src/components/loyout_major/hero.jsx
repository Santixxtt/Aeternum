import imgHome from "../../assets/img/img-home.jpg";
import Login from "../login";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 data-aos="fade-down">
          Bienvenid@ a Nuestra Biblioteca Aeternum
        </h1>
        <p data-aos="fade-up">
          Aquí puedes encontrar una página que te ayudará a explorar los mundos
          fantásticos de la literatura y el conocimiento. ¡Te invitamos a
          sumergirte en nuestros catálogos y disfrutar de tus lecturas!
        </p>
        <a href="../login" className="cta-button" data-aos="zoom-in">
          Únete ahora
        </a><br /><br /><br />  
      </div>
      <div className="hero-image-container">
        <img src={imgHome} alt="imagen" className="img1" data-aos="fade-left" />
      </div>
    </section>
  );
}

export default Hero;