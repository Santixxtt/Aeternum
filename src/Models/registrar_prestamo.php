<?php
session_start();
header('Content-Type: application/json');

// 1. Incluir el archivo de conexión a la base de datos
require_once '../../config/conexion.php'; 

global $conn;

// 2. Verificar que la petición sea POST y que el usuario esté logueado
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_SESSION['id_usuario'])) {
    echo json_encode(['status' => 'error', 'message' => 'Acceso denegado o usuario no logueado.']);
    exit();
}

// 3. Obtener y sanear los datos
$usuario_id = $_SESSION['id_usuario'];
$libro_key = $_POST['libro_key'] ?? '';
$titulo = $_POST['titulo'] ?? 'Título desconocido';
$autor_nombre = $_POST['autor'] ?? 'Autor desconocido';

// Validar datos básicos
if (empty($libro_key)) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos del libro.']);
    exit();
}

try {
    // Iniciar una transacción para asegurar la consistencia de los datos
    $conn->begin_transaction();

    // 4. Buscar o insertar el autor
    // ¡CORRECCIÓN AQUÍ! Tabla 'autores' en lugar de 'autor'
    $sql_autor_existente = "SELECT id FROM autores WHERE nombre = ?";
    $stmt_autor_existente = $conn->prepare($sql_autor_existente);
    $stmt_autor_existente->bind_param("s", $autor_nombre);
    $stmt_autor_existente->execute();
    $result_autor = $stmt_autor_existente->get_result();
    $autor_id = 0;

    if ($result_autor->num_rows > 0) {
        $row = $result_autor->fetch_assoc();
        $autor_id = $row['id'];
    } else {
        // ¡CORRECCIÓN AQUÍ! Tabla 'autores' en lugar de 'autor'
        $sql_insert_autor = "INSERT INTO autores (nombre) VALUES (?)";
        $stmt_insert_autor = $conn->prepare($sql_insert_autor);
        $stmt_insert_autor->bind_param("s", $autor_nombre);
        
        if ($stmt_insert_autor->execute()) {
            $autor_id = $conn->insert_id;
        } else {
            throw new Exception("Error al insertar el autor: " . $stmt_insert_autor->error);
        }
    }

    // 5. Buscar o insertar el libro en la tabla `libros`
    $sql_libro_existente = "SELECT id FROM libros WHERE openlibrary_key = ?";
    $stmt_libro_existente = $conn->prepare($sql_libro_existente);
    $stmt_libro_existente->bind_param("s", $libro_key);
    $stmt_libro_existente->execute();
    $result_libro = $stmt_libro_existente->get_result();
    $libro_id = 0;

    if ($result_libro->num_rows > 0) {
        // El libro ya existe, obtén su ID
        $row = $result_libro->fetch_assoc();
        $libro_id = $row['id'];
    } else {
        // El libro no existe, insértalo.
        $sql_insert_libro = "INSERT INTO libros (titulo, autor_id, openlibrary_key) VALUES (?, ?, ?)";
        $stmt_insert_libro = $conn->prepare($sql_insert_libro);
        $stmt_insert_libro->bind_param("sis", $titulo, $autor_id, $libro_key); 
        
        if ($stmt_insert_libro->execute()) {
            $libro_id = $conn->insert_id;
        } else {
            throw new Exception("Error al insertar el libro: " . $stmt_insert_libro->error);
        }
    }
    
    // 6. Insertar el registro en la tabla `prestamo`
    // ¡CORRECCIÓN AQUÍ! Tabla 'prestamos' en lugar de 'prestamo'
    $sql_check_prestamo = "SELECT id FROM prestamos WHERE usuario_id = ? AND libro_id = ?";
    $stmt_check_prestamo = $conn->prepare($sql_check_prestamo);
    $stmt_check_prestamo->bind_param("ii", $usuario_id, $libro_id);
    $stmt_check_prestamo->execute();
    $result_check = $stmt_check_prestamo->get_result();

    if ($result_check->num_rows > 0) {
        $conn->rollback(); 
        echo json_encode(['status' => 'exists', 'message' => 'Este libro ya ha sido prestado.']);
        exit();
    }

    // ¡CORRECCIÓN AQUÍ! Tabla 'prestamos' en lugar de 'prestamo'
    $sql_insert_prestamo = "INSERT INTO prestamos (usuario_id, libro_id, titulo, autor_id, fecha_prestamo) VALUES (?, ?, ?, ?, NOW())";
    $stmt_insert_prestamo = $conn->prepare($sql_insert_prestamo);
    $stmt_insert_prestamo->bind_param("iisi", $usuario_id, $libro_id, $titulo, $autor_id);

    if ($stmt_insert_prestamo->execute()) {
        $conn->commit();
        echo json_encode(['status' => 'success', 'message' => 'Préstamo registrado con éxito.']);
    } else {
        $conn->rollback();
        throw new Exception("Error al insertar el préstamo: " . $stmt_insert_prestamo->error);
    }

} catch (Exception $e) {
    if ($conn->in_transaction()) {
        $conn->rollback();
    }
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    if (isset($stmt_autor_existente)) $stmt_autor_existente->close();
    if (isset($stmt_insert_autor)) $stmt_insert_autor->close();
    if (isset($stmt_libro_existente)) $stmt_libro_existente->close();
    if (isset($stmt_insert_libro)) $stmt_insert_libro->close();
    if (isset($stmt_check_prestamo)) $stmt_check_prestamo->close();
    if (isset($stmt_insert_prestamo)) $stmt_insert_prestamo->close();
    if (isset($conn)) $conn->close();
}