<?php
    include("../../config/conexion.php");

    if (isset($_GET['token'])) {
        $token = $_GET['token'];

        // Validar token en la base de datos
        $query = "SELECT * FROM solicitudes_recuperacion_contrasena WHERE token = '$token'";
        $result = $conexion->query($query);

        if ($result->num_rows > 0) {
            $userData = $result->fetch_assoc();
            $usuario_id = $userData['usuario_id'];
            // Obtener correo del usuario
            $correo_usuario = '';
            $queryCorreo = "SELECT correo FROM usuarios WHERE id = $usuario_id";
            $resultCorreo = $conexion->query($queryCorreo);
            if ($resultCorreo && $resultCorreo->num_rows > 0) {
                $rowCorreo = $resultCorreo->fetch_assoc();
                $correo_usuario = $rowCorreo['correo'];
            }
        } else {
            echo "Token inválido o expirado.";
            exit;
        }
    } else {
        echo "Token no proporcionado.";
        exit;
    }

    if (!empty($_POST)) {
        $nuevaClave = password_hash($_POST['nueva_clave'], PASSWORD_DEFAULT);

        // Actualizar contraseña
        $update = "UPDATE usuarios SET clave = '$nuevaClave' WHERE id = $usuario_id";
        if ($conexion->query($update)) {
            // Eliminar token después de usarlo
            $deleteToken = "DELETE FROM solicitudes_recuperacion_contrasena WHERE token = '$token'";
            $conexion->query($deleteToken);

            echo "Contraseña actualizada correctamente.";
            header("refresh:3;url=../../public/login.php");
            exit;
        } else {
            echo "Error al actualizar la contraseña.";
        }
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio de Sesión</title>
    <link rel="stylesheet" href="../../public/assets/css/recupera_clave.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>

<body>
    <div class="container">
        <div class="login-section">
            <a href="login.php" class="back-button"><i class='bx bx-chevron-left'></i></a>
            <h1>Restablece la Contraseña</h1>
            <p>El correo <strong><?php echo htmlspecialchars($correo_usuario ?? ''); ?></strong> solicitó el cambio de clave.<br>Escribe una nueva contraseña para poder ingresar a <strong>Aeternum</strong>.</p>

            <form id="loginForm" method="post">
                <div class="form-group">
                    <label for="nueva_clave"><b>Nueva Contraseña</b></label>
                    <div style="position:relative;">
                        <input type="password" id="nueva_clave" name="nueva_clave" placeholder="Tu nueva clave aqui" required style="padding-right:40px;">
                        <i class='bx bx-hide' id="togglePassword" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); cursor:pointer; font-size:1.5em;"></i>
                    </div>
                    <div id="strengthBar" class="password-strength" style="height:8px; border-radius:5px; background:#333; margin-top:10px; margin-bottom:5px; transition:background 0.3s;"></div>
                    <span id="passwordStrengthText" style="font-size:0.9em; color:#bbb;"></span>
                    <button type="submit" class="login-button">Guardar Contraseña</button><br><br>
                </div>
            </form>
        <div class="image-section">
            <img src="../../public/assets/img/recupera.jpg" alt="Img-biblioteca">
        </div>
    </div>

    <script src="../../public/assets/js/reset_password.js"></script>
</body>
</html>
