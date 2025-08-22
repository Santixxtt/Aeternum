    // --- Validación de Email ---
    document.getElementById('email').addEventListener('input', function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.value)) {
            mostrarError('emailError', 'Formato de correo inválido');
            marcarCampo(this, false);
        } else {
            ocultarMensaje('emailError');
            marcarCampo(this, true);
        }
    });

document.querySelector('.toggle-password').addEventListener('click', function() {
  const passwordInput = document.getElementById('password');
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  
  // Cambiar icono de ojo abierto y cerrado
  this.classList.toggle('bx-hide');
  this.classList.toggle('bx-show');
});
