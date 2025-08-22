<?php
    include("../config/conexion.php");

    if (isset($_POST["registrar"])) {
        $nombre = mysqli_real_escape_string($conexion, $_POST["nombres"]);
        $apellido = mysqli_real_escape_string($conexion, $_POST["apellidos"]);
        $tipoid = mysqli_real_escape_string($conexion, $_POST["tipoId"]);
        $numeroid = mysqli_real_escape_string($conexion, $_POST["numeroId"]);
        $email = mysqli_real_escape_string($conexion, $_POST["email"]);
        $password = mysqli_real_escape_string($conexion, $_POST["password"]);
        $password_encriptada = password_hash($password, PASSWORD_DEFAULT);

        // Verificar si el correo ya está registrado
        $sqlCorreo = "SELECT id FROM usuarios WHERE correo = '$email'";
        $resultadoCorreo = $conexion->query($sqlCorreo);
        if ($resultadoCorreo->num_rows > 0) {
            $mensaje = "El correo ya está registrado";
            $redirigir = "registro.php";
        } elseif ($conexion->query("SELECT id FROM usuarios WHERE num_identificacion = '$numeroid'")->num_rows > 0) {
            $mensaje = "El número de identificación ya está registrado";
            $redirigir = "registro.php";
        } else {
            $sqlusuario = "INSERT INTO usuarios(nombre, apellido, tipo_identificacion, num_identificacion, correo, clave) 
                           VALUES ('$nombre', '$apellido', '$tipoid', '$numeroid', '$email', '$password_encriptada')";

            if ($conexion->query($sqlusuario)) {
                $mensaje = "¡Cuenta creada con éxito!";
                $redirigir = "login.php";
            } else {
                $mensaje = "Error al crear la cuenta. Inténtelo de nuevo";
                $redirigir = "registro.php";
            }
        }

        echo "<script>
                alert('$mensaje');
                window.location = '$redirigir';
              </script>";
        exit;
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

            <form id="registroForm" action="<?php $_SERVER["PHP_SELF"]; ?>" method="post">
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