<?php
include("../config/conexion.php");
    session_start();

    // Si ya está logueado, redirigir a la página correcta según su rol
    if (isset($_SESSION['id_usuario'])) {
        if (isset($_SESSION['rol']) && $_SESSION['rol'] === 'bibliotecario') {
            header("Location: ../src/Views/admin.php");
        } else {
            header("Location: ../src/Views/usuario.php");
        }
        exit;
    }

    $error_message = null;

    // Procesar el formulario solo si se envió por POST.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (!empty($_POST["email"]) && !empty($_POST["password"])) {
            $email = trim($_POST["email"]);
            $password = trim($_POST["password"]);

            // Usar consultas preparadas para obtener los datos del usuario
            $sql = "SELECT id, clave, rol, intentos_fallidos, bloqueado_hasta FROM usuarios WHERE correo = ?";
            $stmt = $conexion->prepare($sql);

            if ($stmt) {
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $resultado = $stmt->get_result();

                if ($resultado->num_rows === 1) {
                    $row = $resultado->fetch_assoc();

                    // 1. VERIFICAR SI LA CUENTA ESTÁ BLOQUEADA
                    if ($row['bloqueado_hasta'] && strtotime($row['bloqueado_hasta']) > time()) {
                        $tiempo_restante = ceil((strtotime($row['bloqueado_hasta']) - time()) / 60);
                        $error_message = "Su cuenta está bloqueada. Intente de nuevo en " . $tiempo_restante . " minutos.";
                    } else {
                        // Si no está bloqueada, verificar la contraseña
                        if (password_verify($password, $row["clave"])) {
                            // 2. CONTRASEÑA CORRECTA: Reiniciar intentos y loguear
                            $update_sql = "UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = ?";
                            $update_stmt = $conexion->prepare($update_sql);
                            $update_stmt->bind_param("i", $row['id']);
                            $update_stmt->execute();
                            $update_stmt->close();

                            session_regenerate_id(true);
                            $_SESSION['id_usuario'] = $row["id"];
                            $_SESSION['rol'] = $row["rol"];

                            if ($row['rol'] === 'bibliotecario') {
                                header("Location: ../src/Views/admin.php");
                            } else {
                                header("Location: ../src/Views/usuario.php");
                            }
                            exit;
                        } else {
                            // 3. CONTRASEÑA INCORRECTA: Incrementar intentos
                            $intentos_actuales = $row['intentos_fallidos'] + 1;
                            
                            if ($intentos_actuales >= 3) {
                                // Bloquear la cuenta por 15 minutos
                                $tiempo_bloqueo = date('Y-m-d H:i:s', strtotime('+15 minutes'));
                                $update_sql = "UPDATE usuarios SET intentos_fallidos = ?, bloqueado_hasta = ? WHERE id = ?";
                                $update_stmt = $conexion->prepare($update_sql);
                                $update_stmt->bind_param("isi", $intentos_actuales, $tiempo_bloqueo, $row['id']);
                                $error_message = "Ha excedido el número de intentos. Su cuenta ha sido bloqueada por 15 minutos.";
                            } else {
                                // Solo incrementar el contador
                                $update_sql = "UPDATE usuarios SET intentos_fallidos = ? WHERE id = ?";
                                $update_stmt = $conexion->prepare($update_sql);
                                $update_stmt->bind_param("ii", $intentos_actuales, $row['id']);
                                $error_message = "Correo o Contraseña incorrectos. Le quedan " . (3 - $intentos_actuales) . " intentos.";
                            }
                            $update_stmt->execute();
                            $update_stmt->close();
                        }
                    }
                } else {
                    // Si el correo no existe, dar un mensaje genérico para no revelar información
                    $error_message = "Correo o Contraseña incorrectos. Inténtelo nuevamente.";
                }
                $stmt->close();
            } else {
                $error_message = "Error del servidor. Por favor, intente más tarde.";
            }
        } else {
            $error_message = "Por favor, ingrese su correo y contraseña.";
        }
        $conexion->close();
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
            /* --- Variables de Color (Recomendado) --- */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #2980b9;
    --text-color: #333;
    --link-color: #2980b9;
    --light-bg-color: #f9f9f9;
    --border-color: #ddd;
    --footer-bg-color: #000;
    --footer-text-color: #fff;
}

/* --- Estilos Generales --- */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--light-bg-color);
    color: var(--text-color);
    margin: 0;
    line-height: 1.6;
}

.privacy-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

/* --- Encabezados y Párrafos --- */
h1, h2 {
    color: var(--primary-color);
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

h2 {
    font-size: 1.5rem;
    margin-top: 2rem;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.5rem;
}

.last-updated {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 2rem;
}

/* --- Listas y Enlaces --- */
ul {
    padding-left: 20px;
}

li {
    margin-bottom: 8px;
}

a {
    color: var(--link-color);
    text-decoration: none;
    transition: color 0.3s ease;
}

a:hover {
    text-decoration: underline;
    color: darken(var(--link-color), 10%); /* Usar una función si tienes preprocesador o un color más oscuro directamente */
}

strong {
    color: #000;
}

p {
    margin-bottom: 1rem;
}

/* --- Footer (Mejoras de Organización) --- */
.footer {
    background-color: var(--footer-bg-color);
    color: var(--footer-text-color);
    padding: 30px 20px 0;
    width: 100%;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 30px;
}

.footer-section h3 {
    font-size: 1em;
    margin-bottom: 10px;
    color: #ddd;
}

.footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-section li {
    margin-bottom: 5px;
}

.footer-section a {
    color: #ccc;
    text-decoration: none;
    font-size: 0.9em;
}

.footer-section a:hover {
    text-decoration: underline;
    color: var(--footer-text-color);
}

.footer-bottom {
    text-align: center;
    border-top: 1px solid #333;
    padding: 15px 20px;
    font-size: 0.85em;
    color: #aaa;
}

/* --- Media Queries (Mejorado) --- */
@media (max-width: 768px) {
    .privacy-container {
        padding: 10px;
    }
    
    h1 {
        font-size: 2rem;
    }
    
    h2 {
        font-size: 1.3rem;
    }
}
            <h1>Inicio de sesión</h1>
            <p>Inicio de sesión con tu cuenta de <strong>Aeternum</strong></p>

            <form id="loginForm" method="post">
                <?php if ($error_message): ?>
                    <div class="error-box" style="color: red; background-color: #323232ff; padding: 10px; border-radius: 5px; margin-bottom: 15px; text-align: center;">
                        <?php echo htmlspecialchars($error_message); ?>
                    </div>
                <?php endif; ?>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required placeholder="hey@tuemail.com"
                           value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
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