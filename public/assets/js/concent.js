document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('consentModal');
    const acceptBtn = document.getElementById('acceptConsent');
    const closeBtn = document.querySelector('.close-button');

    // Comprueba si el usuario ya ha aceptado el consentimiento
    const hasAccepted = localStorage.getItem('consentimiento_aceptado');

    if (!hasAccepted) {
        // Si no ha aceptado, muestra el modal
        modal.style.display = 'flex';
        setTimeout(() => {
            document.querySelector('.modal-content').classList.add('modal-content-animated');
        }, 10); // Retraso para la animación
    }

    // Lógica para el botón de aceptar
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('consentimiento_aceptado', 'true');
        hideModal();
    });

    // Lógica para el botón de cerrar (la X)
    closeBtn.addEventListener('click', () => {
        hideModal();
    });
    
    //Oculta el modal al hacer clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    function hideModal() {
        document.querySelector('.modal-content').classList.remove('modal-content-animated');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
});