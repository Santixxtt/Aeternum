const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('nueva_clave');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('bx-hide');
            togglePassword.classList.toggle('bx-show');
        });
    }

    // Barra de fortaleza de contraseña
    passwordInput.addEventListener('input', function () {
        const password = this.value;
        const fortaleza = calcularFortalezaPassword(password);
        actualizarBarraFortaleza(fortaleza);
    });

    function calcularFortalezaPassword(password) {
        let puntos = 0;
        if (password.length >= 8) puntos++;
        if (password.length >= 12) puntos++;
        if (/[a-z]/.test(password)) puntos++;
        if (/[A-Z]/.test(password)) puntos++;
        if (/[0-9]/.test(password)) puntos++;
        if (/[^A-Za-z0-9]/.test(password)) puntos++;

        const niveles = ['muy débil', 'débil', 'media', 'fuerte', 'muy fuerte'];
        const nivel = Math.min(Math.floor(puntos / 1.2), 4);
        return { nivel, texto: niveles[nivel], puntos };
    }

    function actualizarBarraFortaleza(fortaleza) {
        const barra = document.getElementById('strengthBar');
        const texto = document.getElementById('passwordStrengthText');
        if (barra && texto) {
            const colores = ['#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#993A90'];
            barra.style.background = colores[fortaleza.nivel];
            texto.textContent = `Fortaleza: ${fortaleza.texto}`;
        }
    }