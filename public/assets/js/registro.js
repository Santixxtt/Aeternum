document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('registroForm');
    const btnEnviar = formulario.querySelector('button[type="submit"]');

    // Campos clave
    const nombresInput = document.getElementById('nombres');
    const apellidosInput = document.getElementById('apellidos');
    const tipoIdSelect = document.getElementById('tipoId');
    const numeroIdInput = document.getElementById('numeroId');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const consentCheckbox = document.getElementById('consent');

    // Errores
    const nombresError = document.getElementById('nombresError');
    const apellidosError = document.getElementById('apellidosError');
    const tipoIdError = document.getElementById('tipoIdError');
    const numeroIdError = document.getElementById('numeroIdError');
    const emailError = document.getElementById('emailError');
    const claveError = document.getElementById('claveError');

    // Barra de fortaleza
    const strengthBar = document.getElementById('strengthBar');
    const passwordStrengthText = document.getElementById('passwordStrengthText');

    // Estado de validación inicial (todos false)
    let estadoValidacion = {
        nombres: false,
        apellidos: false,
        tipoId: false,
        numeroId: false,
        email: false,
        password: false,
        consent: false
    };

    // Deshabilitar botón al inicio
    if (btnEnviar) btnEnviar.disabled = true;

    // --- Helpers ---
    function mostrarError(el, mensaje) {
        if (!el) return;
        el.textContent = mensaje;
        el.style.display = 'block';
    }
    function ocultarMensaje(el) {
        if (!el) return;
        el.textContent = '';
        el.style.display = 'none';
    }
    function marcarCampoVisual(campo, esValido) {
        if (!campo) return;
        campo.classList.toggle('valido', esValido);
        campo.classList.toggle('invalido', !esValido);
    }
    function actualizarBoton() {
        const todoValido = Object.values(estadoValidacion).every(v => v === true);
        if (btnEnviar) btnEnviar.disabled = !todoValido;
    }

    // --- Nombres ---
    if (nombresInput) {
        nombresInput.addEventListener('input', function() {
            const v = this.value.trim();
            if (v.length < 3) {
                mostrarError(nombresError, 'Debe tener al menos 3 caracteres');
                estadoValidacion.nombres = false;
                marcarCampoVisual(this, false);
            } else {
                ocultarMensaje(nombresError);
                estadoValidacion.nombres = true;
                marcarCampoVisual(this, true);
            }
            actualizarBoton();
        });
    }

    // --- Apellidos ---
    if (apellidosInput) {
        apellidosInput.addEventListener('input', function() {
            const v = this.value.trim();
            if (v.length < 3) {
                mostrarError(apellidosError, 'Debe tener al menos 3 caracteres');
                estadoValidacion.apellidos = false;
                marcarCampoVisual(this, false);
            } else {
                ocultarMensaje(apellidosError);
                estadoValidacion.apellidos = true;
                marcarCampoVisual(this, true);
            }
            actualizarBoton();
        });
    }

    // --- Tipo de identificación (select) ---
    if (tipoIdSelect) {
        tipoIdSelect.addEventListener('change', function() {
            if (this.value === "") {
                mostrarError(tipoIdError, 'Seleccione un tipo de identificación.');
                estadoValidacion.tipoId = false;
                this.classList.add('input-error');
            } else {
                ocultarMensaje(tipoIdError);
                estadoValidacion.tipoId = true;
                this.classList.remove('input-error');
            }
            actualizarBoton();
        });
    }

    // --- Email ---
    if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        emailInput.addEventListener('input', function() {
            const v = this.value.trim();
            if (!emailRegex.test(v)) {
                mostrarError(emailError, 'Formato de correo inválido');
                estadoValidacion.email = false;
                marcarCampoVisual(this, false);
            } else {
                ocultarMensaje(emailError);
                estadoValidacion.email = true;
                marcarCampoVisual(this, true);
            }
            actualizarBoton();
        });
    }

    // --- Número de identificación ---
    if (numeroIdInput) {
        const soloNumerosRegex = /^[0-9]+$/;

        // input: forzar solo dígitos y max length 10
        numeroIdInput.addEventListener('input', function() {
            // Reemplazar cualquier carácter no numérico
            let cleaned = this.value.replace(/\D+/g, '');
            if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);
            if (this.value !== cleaned) this.value = cleaned;

            // Validaciones en tiempo real
            if (cleaned.length === 0) {
                ocultarMensaje(numeroIdError);
                estadoValidacion.numeroId = false;
                marcarCampoVisual(this, false);
            } else if (!soloNumerosRegex.test(cleaned)) {
                mostrarError(numeroIdError, 'Ingrese solo números.');
                estadoValidacion.numeroId = false;
                marcarCampoVisual(this, false);
            } else if (cleaned.length < 8 || cleaned.length > 10) {
                mostrarError(numeroIdError, 'El número debe tener entre 8 y 10 dígitos.');
                estadoValidacion.numeroId = false;
                marcarCampoVisual(this, false);
            } else {
                ocultarMensaje(numeroIdError);
                estadoValidacion.numeroId = true;
                marcarCampoVisual(this, true);
            }
            actualizarBoton();
        });

        // blur: mensaje más específico si no cumple
        numeroIdInput.addEventListener('blur', function() {
            const v = this.value.trim();
            if (v.length === 0) {
                mostrarError(numeroIdError, 'El número de identificación es obligatorio.');
                estadoValidacion.numeroId = false;
                marcarCampoVisual(this, false);
            } else if (!soloNumerosRegex.test(v)) {
                mostrarError(numeroIdError, 'Ingrese solo números.');
                estadoValidacion.numeroId = false;
                marcarCampoVisual(this, false);
            } else if (v.length < 8 || v.length > 10) {
                mostrarError(numeroIdError, 'El número debe tener entre 8 y 10 dígitos.');
                estadoValidacion.numeroId = false;
                marcarCampoVisual(this, false);
            } else {
                ocultarMensaje(numeroIdError);
                estadoValidacion.numeroId = true;
                marcarCampoVisual(this, true);
            }
            actualizarBoton();
        });
    }

    // --- Contraseña + fortaleza ---
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const fortaleza = calcularFortalezaPassword(password);
            actualizarBarraFortaleza(fortaleza);

            if (password.length < 8) {
                mostrarError(claveError, 'Debe tener al menos 8 caracteres');
                estadoValidacion.password = false;
                marcarCampoVisual(this, false);
            } else if (fortaleza.nivel < 2) {
                mostrarError(claveError, 'Contraseña débil. Usa mayúsculas, números y símbolos.');
                estadoValidacion.password = false;
                marcarCampoVisual(this, false);
            } else {
                ocultarMensaje(claveError);
                estadoValidacion.password = true;
                marcarCampoVisual(this, true);
            }
            actualizarBoton();
        });
    }

    // --- Toggle ver/ocultar contraseña ---
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('bx-hide');
            togglePassword.classList.toggle('bx-show');
        });
    }

    // --- Consent checkbox ---
    if (consentCheckbox) {
        consentCheckbox.addEventListener('change', function() {
            if (this.checked) {
                estadoValidacion.consent = true;
            } else {
                estadoValidacion.consent = false;
            }
            actualizarBoton();
        });
    }

    // --- Envío del formulario ---
    formulario.addEventListener('submit', function(event) {
        // Revalidar todo por seguridad
        // Nombres y apellidos
        if (!nombresInput || nombresInput.value.trim().length < 3) {
            mostrarError(nombresError, 'Debe tener al menos 3 caracteres');
            estadoValidacion.nombres = false;
            if (nombresInput) marcarCampoVisual(nombresInput, false);
        }
        if (!apellidosInput || apellidosInput.value.trim().length < 3) {
            mostrarError(apellidosError, 'Debe tener al menos 3 caracteres');
            estadoValidacion.apellidos = false;
            if (apellidosInput) marcarCampoVisual(apellidosInput, false);
        }

        // Tipo Id
        if (!tipoIdSelect || tipoIdSelect.value === "") {
            mostrarError(tipoIdError, 'Seleccione un tipo de identificación.');
            estadoValidacion.tipoId = false;
            if (tipoIdSelect) tipoIdSelect.classList.add('input-error');
        }

        // Numero ID (revalidar)
        if (!numeroIdInput || numeroIdInput.value.trim() === "") {
            mostrarError(numeroIdError, 'El número de identificación es obligatorio.');
            estadoValidacion.numeroId = false;
            if (numeroIdInput) marcarCampoVisual(numeroIdInput, false);
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
            mostrarError(emailError, 'Formato de correo inválido');
            estadoValidacion.email = false;
            if (emailInput) marcarCampoVisual(emailInput, false);
        }

        // Password
        if (!passwordInput || passwordInput.value.length < 8) {
            mostrarError(claveError, 'Debe tener al menos 8 caracteres');
            estadoValidacion.password = false;
            if (passwordInput) marcarCampoVisual(passwordInput, false);
        }

        // Consent
        if (!consentCheckbox || !consentCheckbox.checked) {
            alert('Debes aceptar la Política de Privacidad para crear la cuenta.');
            estadoValidacion.consent = false;
        }

        // Si alguno no válido, evitar submit
        const todoValido = Object.values(estadoValidacion).every(v => v === true);
        if (!todoValido) {
            event.preventDefault();
            alert('Por favor, complete correctamente todos los campos antes de continuar.');
            actualizarBoton();
            return false;
        }

        // si todo ok, el formulario se enviará normalmente (server-side hará más validaciones)
    });

    // --- Fortaleza de password (misma lógica con ajuste de niveles) ---
    function calcularFortalezaPassword(password) {
        let puntos = 0;
        if (password.length >= 8) puntos++;
        if (password.length >= 12) puntos++;
        if (/[a-z]/.test(password)) puntos++;
        if (/[A-Z]/.test(password)) puntos++;
        if (/[0-9]/.test(password)) puntos++;
        if (/[^A-Za-z0-9]/.test(password)) puntos++;

        // Mapear puntos a niveles 0-4
        let nivel = 0;
        if (puntos <= 1) nivel = 0;
        else if (puntos <= 3) nivel = 1;
        else if (puntos === 4) nivel = 2;
        else if (puntos === 5) nivel = 3;
        else nivel = 4;

        const niveles = ['muy débil', 'débil', 'media', 'fuerte', 'muy fuerte'];
        return { nivel, texto: niveles[nivel], puntos };
    }

    function actualizarBarraFortaleza(fortaleza) {
        if (!strengthBar || !passwordStrengthText) return;
        const clases = ['very-weak', 'weak', 'medium', 'strong', 'very-strong'];
        // Quitar clases previas
        strengthBar.className = 'password-strength ' + clases[fortaleza.nivel];
        passwordStrengthText.textContent = `Fortaleza: ${fortaleza.texto}`;
    }

    // Inicializar (por si el formulario tiene datos precargados)
    // Forzar validaciones iniciales
    if (nombresInput) nombresInput.dispatchEvent(new Event('input'));
    if (apellidosInput) apellidosInput.dispatchEvent(new Event('input'));
    if (emailInput) emailInput.dispatchEvent(new Event('input'));
    if (passwordInput) passwordInput.dispatchEvent(new Event('input'));
    if (numeroIdInput) numeroIdInput.dispatchEvent(new Event('input'));
    if (tipoIdSelect) tipoIdSelect.dispatchEvent(new Event('change'));
    if (consentCheckbox) consentCheckbox.dispatchEvent(new Event('change'));

    actualizarBoton();
});
