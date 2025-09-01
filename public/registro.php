<?php

    include("../config/conexion.php");

    if (isset($_POST["registrar"])) {
        // sanitize básicos (mysqli_real_escape_string ya no es suficiente si usamos prepared statements,
        // pero lo mantengo para coherencia con tu código original)
        $nombre = trim($_POST["nombres"] ?? '');
        $apellido = trim($_POST["apellidos"] ?? '');
        $tipoid = trim($_POST["tipoId"] ?? '');
        $numeroid = trim($_POST["numeroId"] ?? '');
        $email = trim($_POST["email"] ?? '');
        $password = $_POST["password"] ?? '';

        // Validación mínima server-side
        if (empty($nombre) || empty($apellido) || empty($tipoid) || empty($numeroid) || empty($email) || empty($password)) {
            echo "<script>
                    alert('Por favor complete todos los campos requeridos.');
                    window.location = 'registro.php';
                  </script>";
            exit;
        }

        // Validar consentimiento (server-side)
        if (!isset($_POST['consent'])) {
            echo "<script>
                    alert('Debes aceptar la Política de Privacidad para crear la cuenta.');
                    window.location = 'registro.php';
                  </script>";
            exit;
        }

        // Encriptar contraseña
        $password_encriptada = password_hash($password, PASSWORD_DEFAULT);

        // ---------- Comprobar si el correo ya existe (prepared statement) ----------
        $stmt = $conexion->prepare("SELECT id FROM usuarios WHERE correo = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $stmt->close();
            echo "<script>
                    alert('El correo ya está registrado');
                    window.location = 'registro.php';
                  </script>";
            exit;
        }
        $stmt->close();

        // ---------- Comprobar si el número de identificación ya existe ----------
        $stmt = $conexion->prepare("SELECT id FROM usuarios WHERE num_identificacion = ?");
        $stmt->bind_param("s", $numeroid);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $stmt->close();
            echo "<script>
                    alert('El número de identificación ya está registrado');
                    window.location = 'registro.php';
                  </script>";
            exit;
        }
        $stmt->close();

        // ---------- Insertar usuario ----------
        $stmt = $conexion->prepare("INSERT INTO usuarios (nombre, apellido, tipo_identificacion, num_identificacion, correo, clave) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $nombre, $apellido, $tipoid, $numeroid, $email, $password_encriptada);

        if ($stmt->execute()) {
            // Obtener el id del usuario creado
            $user_id = $conexion->insert_id;
            $stmt->close();

            // ---------- Registrar consentimiento ----------
            // Define la key y el texto (puedes versionarlo cuando actualices la política)
            $consent_key = 'privacy_policy_v1';
            $consent_text = 'Acepto la Política de Privacidad de Aeternum (v1) - ' . date('Y-m-d');

            $ip = $_SERVER['REMOTE_ADDR'] ?? '';
            $user_agent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255);

            $stmt2 = $conexion->prepare("INSERT INTO consents (user_id, consent_key, consent_text, granted, ip_address, user_agent) VALUES (?, ?, ?, 1, ?, ?)");
            if ($stmt2) {
                $stmt2->bind_param("issss", $user_id, $consent_key, $consent_text, $ip, $user_agent);
                $okConsent = $stmt2->execute();
                // Si falla la inserción del consent, no cancelo la creación de la cuenta, pero podrías registrar/loggear $stmt2->error
                $stmt2->close();
            } else {
                // Preparación fallida: opcionalmente loggear $conexion->error
                $okConsent = false;
            }

            // Mensaje final y redirección
            echo "<script>
                    alert('¡Cuenta creada con éxito!');
                    window.location = 'login.php';
                  </script>";
            exit;
        } else {
            // Error inserción usuario
            $stmt->close();
            echo "<script>
                    alert('Error al crear la cuenta. Inténtelo de nuevo');
                    window.location = 'registro.php';
                  </script>";
            exit;
        }
    }
?>



<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/registro.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <title>Registro</title>
</head>

<body>
    <div class="container">
        <div class="login-section">
            <a href="login.php" class="back-button"><i class='bx bx-chevron-left'></i></a>
            <h1>Registro</h1>
            <p>Ingrese sus datos para registrarse a <strong>Aeternum</strong></p>

            <form id="registroForm" action="<?php echo $_SERVER["PHP_SELF"]; ?>" method="post">
                <div class="form-group">
                    <label for="nombres">Nombres</label>
                    <input type="text" id="nombres" name="nombres" required placeholder="Ingresa tus nombres">
                    <p class="error-message" id="nombresError"></p>
                </div>

                <div class="form-group">
                    <label for="apellidos">Apellidos</label>
                    <input type="text" id="apellidos" name="apellidos" required placeholder="Ingresa tus apellidos">
                    <p class="error-message" id="apellidosError"></p>
                </div>

                <div class="form-group">
                    <label for="tipoId">Tipo de Identificación</label>
                        <select id="tipoId" name="tipoId" required>
                            <option value="">Seleccione un tipo</option>
                            <option value="CC">Cédula de Ciudadanía</option>
                            <option value="CE">Cédula Extranjera</option>
                            <option value="TI">Tarjeta de Identidad</option>
                        </select>
                    <p class="error-message" id="tipoIdError"></p>
                </div>

                <div class="form-group">
                    <label for="numeroid">Número de Identificación</label>
                    <input type="number" id="numeroId" name="numeroId" required placeholder="Ej. 1234567890" maxlength="10">
                    <p class="error-message" id="numeroIdError"></p>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required placeholder="hey@tuemail.com">
                    <p class="error-message" id="emailError"></p>
                </div>

                <div class="form-group password-wrapper">
                    <label for="clave">Contraseña</label>
                    <input type="password" id="password" name="password" required placeholder="Crea una contraseña">
                    <i class='bx bx-hide toggle-password' id="togglePassword"></i>

                    <!--Indicador de seguridad de la clave -->
                    <div class="password-strength-container">
                        <div id="strengthBar" class="password-strength"></div>
                        <small id="passwordStrengthText"></small>
                    </div>

                    <p class="error-message" id="claveError"></p>
                </div>

                <label class="consent-line">
                    <input type="checkbox" id="consent" name="consent" required>
                    He leído y acepto la <a href="politica_privacidad.html" target="_blank" rel="noopener">Política de Privacidad</a>.
                </label>

                <button type="submit" class="login-button" name="registrar">Crear Cuenta</button>
            </form>


            <p class="register-link">¿Ya tienes cuenta? <a href="login.php">Inicia Sesión</a></p>
        </div>
        <div class="image-section">
            <img src="assets/img/registro.jpg" alt="Img-biblioteca">
        </div>
    </div>

    <script src="assets/js/registro.js"></script>
</body>
</html>