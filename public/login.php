<?php
    include("../config/conexion.php");

    session_start();
    if(isset($_SESSION['id_usuario'])){
        header("Location: ../src/Views/usuario.php");
    }

    if (!empty($_POST)) {
        $email = mysqli_real_escape_string($conexion, $_POST["email"]);
        $password = mysqli_real_escape_string($conexion, $_POST["password"]);

        $sql = "SELECT id, clave FROM usuarios WHERE correo = '$email'";
        $resultado = $conexion->query($sql);
        $rows = $resultado->num_rows;
        
        if ($rows > 0) {
            $row = $resultado->fetch_assoc();
            if (password_verify($password, $row["clave"])) {
                $_SESSION['id_usuario'] = $row["id"];
                header("Location: ../src/Views/usuario.php");
                exit(); // Detener el script aquí
            }
        }

        echo "<script>
                alert('Correo o Contraseña incorrectos. Inténtelo nuevamente o cree una cuenta');
                window.location = 'login.php';
              </script>";
    }
?>


<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio de Sesión</title>
    <link rel="stylesheet" href="assets/css/login.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>

<body>
    <div class="container">
        <div class="login-section">
            <a href="index.html" class="back-button"><i class='bx bx-chevron-left'></i></a>
            <h1>Inicio de sesión</h1>
            <p>Inicio de sesión con tu cuenta de <strong>Aeternum</strong></p>

            <form id="loginForm" method="post">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required placeholder="hey@tuemail.com">
                    <p class="error-message" id="emailError"></p>
                </div>

                <div class="form-group password-wrapper">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" name="password" required
                        placeholder="Escribe tu contraseña aquí">
                    <i class='bx bx-hide toggle-password'></i>
                    <p class="error-message" id="passwordError"></p>
                </div>

                    <button type="submit" class="login-button">Inicia sesión</button>

            </form>

            <div class="register-options">
                <p class="register-link">¿No tienes cuenta? <a href="registro.php">Regístrate</a></p>
                <p class="register-link">¿Te olvidaste de la contraseña? <a href="../src/Views/recuperar_clave.php">Recupérala</a></p>
            </div>
        </div>
        <div class="image-section">
            <img src="assets/img/login.jpg" alt="Img-biblioteca">
        </div>
    </div>

    <script src="assets/js/login.js"></script>
</body>
</html>