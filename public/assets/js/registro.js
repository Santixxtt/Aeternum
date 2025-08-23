document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('registroForm');
    const campos = formulario.querySelectorAll('input');
    const btnEnviar = formulario.querySelector('button[type="submit"]');

    let estadoValidacion = {};
    campos.forEach((campo) => {
        
        estadoValidacion[campo.name] = false; // Ajusta esto si algunos campos no son requeridos al inicio
    });

    // --- Validación de Nombres ---
    document.getElementById('nombres').addEventListener('input', function () {
        const valor = this.value.trim();
        if (valor.length < 3) {
            mostrarError('nombresError', 'Debe tener al menos 3 caracteres');
            marcarCampo(this, false);
        } else {
            ocultarMensaje('nombresError');
            marcarCampo(this, true);
        }
    });

    // --- Validación de Apellidos ---
    document.getElementById('apellidos').addEventListener('input', function () {
        const valor = this.value.trim();
        if (valor.length < 3) {
            mostrarError('apellidosError', 'Debe tener al menos 3 caracteres');
            marcarCampo(this, false);
        } else {
            ocultarMensaje('apellidosError');
            marcarCampo(this, true);
        }
    });

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

    // --- Validación de Número de Identificación (en tiempo real y al perder el foco) ---
    const numeroIdInput = document.getElementById('numeroId');
    const numeroIdError = document.getElementById('numeroIdError');
    const soloNumerosRegex = /^[0-9]+$/; // Define el regex una sola vez

    // Listener para limitar los caracteres mientras se escribe
    numeroIdInput.addEventListener('input', function() {
        // Limita a 10 caracteres
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
        // Limpia el mensaje de error inmediatamente para una mejor UX mientras el usuario escribe
        numeroIdError.textContent = "";
        this.classList.remove('input-error', 'valido', 'invalido'); // Limpiar clases para reevaluar
        estadoValidacion[this.name] = false; // Asume inválido mientras no cumpla

        // Aplicar validaciones básicas en tiempo real si el campo no está vacío
        if (this.value.trim().length > 0) {
            if (!soloNumerosRegex.test(this.value.trim())) {
                mostrarError('numeroIdError', "Ingrese solo números.");
                marcarCampo(this, false);
            } else if (this.value.trim().length >= 8 && this.value.trim().length <= 10) { 
                ocultarMensaje('numeroIdError');
                marcarCampo(this, true);
            } else {
                mostrarError('numeroIdError', 'El número de identificación debe tener entre 8 y 10 dígitos.');
                marcarCampo(this, false);
            }

        } else {
            // Si está vacío, no mostrar error de longitud aún, solo marcar como inválido
            marcarCampo(this, false);
        }
        // Actualizar el botón de envío después de cada input
        actualizarBoton();
    });

    // Listener para validar cuando el usuario sale del campo (blur)
    numeroIdInput.addEventListener('blur', function() {
        const valor = this.value.trim();
        // Solo valida si el campo no está vacío, si está vacío el error se maneja en el submit
        if (valor.length > 0) {
            if (!soloNumerosRegex.test(valor)) {
                mostrarError('numeroIdError', "Ingrese solo números.");
                marcarCampo(this, false);
            } else if (valor.length < 8 || valor.length > 10) { // Validación exacta de 10 dígitos al enviar
                mostrarError('numeroIdError', "El número de identificación debe tener exactamente 10 dígitos.");
                marcarCampo(this, false);
            } else {
                ocultarMensaje('numeroIdError');
                marcarCampo(this, true);
            }
        } else {
            // Si el campo está vacío al salir, asegúrate de que esté marcado como inválido
            marcarCampo(this, false);
        }
        actualizarBoton();
    });


    // --- Validación de Contraseña + Fortaleza ---
    document.getElementById('password').addEventListener('input', function () {
        const password = this.value;
        const fortaleza = calcularFortalezaPassword(password);
        actualizarBarraFortaleza(fortaleza);

        if (password.length < 8) {
            mostrarError('claveError', 'Debe tener al menos 8 caracteres');
            marcarCampo(this, false);
        } else if (fortaleza.nivel < 2) { // Nivel 2 o superior para considerarse aceptable
            mostrarError('claveError', 'Contraseña débil. Usa números y símbolos.');
            marcarCampo(this, false);
        } else {
            ocultarMensaje('claveError');
            marcarCampo(this, true);
        }
    });

    // --- Mostrar/Ocultar Contraseña ---
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    if (togglePassword && passwordInput) { // Verificar si los elementos existen
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('bx-hide');
            togglePassword.classList.toggle('bx-show');
        });
    }


    // --- Evento de Envío del Formulario ---
    formulario.addEventListener('submit', function (event) {
        let validoFormulario = true; // Renombré 'valido' para evitar conflictos con la lógica de 'marcarCampo'

        // Re-validar todos los campos requeridos justo antes del envío
        // Esto es crucial porque los eventos 'input' o 'blur' pueden no haber cubierto todos los casos
        // o el usuario pudo haber dejado campos sin interactuar.

        // Validar Tipo de Identificación (obligatorio)
        const tipoId = document.getElementById('tipoId');
        const tipoIdError = document.getElementById('tipoIdError');
        if (tipoId.value === "") {
            mostrarError('tipoIdError', "Seleccione un tipo de identificación.");
            tipoId.classList.add('input-error');
            validoFormulario = false;
            estadoValidacion[tipoId.name] = false; // Asegura que el estado se refleje
        } else {
            ocultarMensaje('tipoIdError');
            tipoId.classList.remove('input-error');
            estadoValidacion[tipoId.name] = true;
        }

        // Validar Número de Identificación (obligatorio, solo números, 10 dígitos)
        const numeroId = document.getElementById('numeroId');
        const soloNumeros = /^[0-9]+$/; // Asegúrate de que este regex esté definido

        if (numeroId.value.trim() === "") {
            mostrarError('numeroIdError', "El número de identificación es obligatorio.");
            numeroId.classList.add('input-error');
            validoFormulario = false;
            estadoValidacion[numeroId.name] = false;
        } else if (!soloNumeros.test(numeroId.value.trim())) {
            mostrarError('numeroIdError', "Ingrese solo números.");
            numeroId.classList.add('input-error');
            validoFormulario = false;
            estadoValidacion[numeroId.name] = false;
        } else if (numeroId.value.trim().length < 8 || numeroId.value.trim().length > 10) { 
            mostrarError('numeroIdError', "El número de identificación debe tener entre 8 y 10 dígitos.");
            numeroId.classList.add('input-error');
            validoFormulario = false;
            estadoValidacion[numeroId.name] = false;
        } else {
            ocultarMensaje('numeroIdError');
            numeroId.classList.remove('input-error');
            estadoValidacion[numeroId.name] = true;
        }


        // Volver a validar todos los campos de texto por si el usuario no interactuó con ellos
        ['nombres', 'apellidos', 'email', 'password'].forEach(id => {
            const campo = document.getElementById(id);
            // Simular el evento 'input' para disparar sus validaciones si el campo no ha sido marcado como válido
            if (!estadoValidacion[campo.name]) {
                 campo.dispatchEvent(new Event('input'));
            }
            if (!estadoValidacion[campo.name]) { // Después de la revalidación, verifica si aún es inválido
                validoFormulario = false;
            }
        });

        // Finalmente, comprueba el estado general del formulario
        if (!validoFormulario) {
            event.preventDefault(); // Evita el envío si hay errores
            alert('Por favor, complete todos los campos correctamente.'); // Mensaje genérico
        }
    });

    // --- FUNCIONES AUXILIARES (sin cambios significativos, se mantienen como estaban) ---

    function mostrarError(id, mensaje) {
        const el = document.getElementById(id);
        if (el) { // Asegura que el elemento existe antes de manipularlo
            el.textContent = mensaje;
            el.style.display = 'block';
        }
    }

    function ocultarMensaje(id) {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    }

    function marcarCampo(campo, esValido) {
        // Solo actualiza el estado y las clases visuales, no dispara un alert o preventDefault aquí
        estadoValidacion[campo.name] = esValido;
        campo.classList.toggle('valido', esValido);
        campo.classList.toggle('invalido', !esValido);
        actualizarBoton();
    }

    function actualizarBoton() {
        const todoValido = Object.values(estadoValidacion).every((v) => v);
        btnEnviar.disabled = !todoValido;
    }

    // --- FORTALEZA DE CONTRASEÑA ---

    function calcularFortalezaPassword(password) {
        let puntos = 0;
        if (password.length >= 8) puntos++;
        if (password.length >= 12) puntos++;
        if (/[a-z]/.test(password)) puntos++;
        if (/[A-Z]/.test(password)) puntos++;
        if (/[0-9]/.test(password)) puntos++;
        if (/[^A-Za-z0-9]/.test(password)) puntos++;

        const niveles = ['muy débil', 'débil', 'media', 'fuerte', 'muy fuerte'];
        const nivel = Math.min(Math.floor(puntos / 1.2), 4); // Asegura que el nivel no exceda el índice del array
        return { nivel, texto: niveles[nivel], puntos };
    }

    function actualizarBarraFortaleza(fortaleza) {
        const barra = document.getElementById('strengthBar');
        const texto = document.getElementById('passwordStrengthText');

        if (barra && texto) { // Asegura que los elementos existen
            const clases = ['weak', 'weak', 'medium', 'strong', 'very-strong'];
            barra.className = 'password-strength ' + clases[fortaleza.nivel];

            texto.textContent = `Fortaleza: ${fortaleza.texto}`;
        }
    }

    // Inicializar estado del botón al cargar la página
    actualizarBoton();
});