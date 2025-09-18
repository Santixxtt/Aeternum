import { useState } from "react";

function ConsentModal() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-content">
        <span className="close-button" onClick={() => setIsOpen(false)}>&times;</span>
        <h2>Consentimiento Informado</h2>
        <p>
          Al utilizar este sitio web, usted acepta los términos de nuestra Política de Privacidad.
        </p>
        <p>
          Al hacer clic en "Aceptar", confirma que ha leído y está de acuerdo con nuestra{" "}
          <a href="politica_privacidad.html" target="_blank" rel="noopener noreferrer">
            Política de Privacidad
          </a>.
        </p>
        <button className="accept-button" onClick={() => setIsOpen(false)}>
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default ConsentModal;
