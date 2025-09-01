<?php
    session_start();

    // 1. Verificamos si el usuario ha iniciado sesión.
    if (!isset($_SESSION['id_usuario'])) {
        header("Location: ../../public/login.php");
        exit;
    }

    // 2. Verificamos si el usuario tiene el rol de Administrador.
    //    Ahora verificamos si el rol es 'bibliotecario'.
    if (!isset($_SESSION['rol']) || $_SESSION['rol'] != 'bibliotecario') {
        // Si no es bibliotecario, lo redirigimos a la página de usuario normal.
        header("Location: usuario.php");
        exit;
    }



    // Si llegamos hasta aquí, el usuario es un administrador autenticado.
    // Podemos cargar sus datos si es necesario.
    include("../../config/conexion.php");
    $id_user = $_SESSION['id_usuario'];
    $sql = "SELECT nombre, apellido FROM usuarios WHERE id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id_user);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $admin = $resultado->fetch_assoc();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Panel de Administrador</title>
    <link rel="stylesheet" href="../../public/assets/css/usuario.css"> <!-- Puedes usar el mismo CSS o crear uno nuevo -->
</head>
<body>
    <h1>Panel de Administración de Aeternum</h1>
    <h2>Bienvenido, <?php echo htmlspecialchars($admin['nombre']. ' '.$admin['apellido']); ?>.</h2>
    <p>Aquí puedes gestionar usuarios, libros y más.</p>
    <a href="../Controllers/logout.php">Cerrar Sesión</a>
</body>
</html>

