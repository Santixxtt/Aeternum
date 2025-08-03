<?php
session_start();
header('Content-Type: application/json');

// Conexión a la base de datos
include("../../config/conexion.php");

// Verifica si el usuario está logueado
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado']);
    exit;
}

$usuario_id = $_SESSION['id_usuario'];

// Validar que recibimos todos los datos por POST
if (!isset($_POST['libro_key'], $_POST['titulo'], $_POST['autor'], $_POST['cover_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
    exit;
}

$libro_key = $_POST['libro_key'];
$titulo = $_POST['titulo'];
$autor_completo = $_POST['autor'];
// Separar nombre y apellido (toma el último como apellido)
$autor_nombre = '';
$autor_apellido = '';
if (strpos($autor_completo, ' ') !== false) {
    $partes = explode(' ', $autor_completo);
    $autor_apellido = array_pop($partes);
    $autor_nombre = implode(' ', $partes);
} else {
    $autor_nombre = $autor_completo;
    $autor_apellido = '';
}
$cover_id = intval($_POST['cover_id']);

// Buscar autor por nombre y apellido en la tabla autores
$sql_autor = "SELECT id FROM autores WHERE nombre = ? AND apellido = ?";
$stmt_autor = $conexion->prepare($sql_autor);
$stmt_autor->bind_param("ss", $autor_nombre, $autor_apellido);
$stmt_autor->execute();
$stmt_autor->store_result();
if ($stmt_autor->num_rows > 0) {
    $stmt_autor->bind_result($autor_id);
    $stmt_autor->fetch();
} else {
    // Si no existe, lo creamos
    $sql_insert_autor = "INSERT INTO autores (nombre, apellido) VALUES (?, ?)";
    $stmt_insert_autor = $conexion->prepare($sql_insert_autor);
    $stmt_insert_autor->bind_param("ss", $autor_nombre, $autor_apellido);
    if ($stmt_insert_autor->execute()) {
        $autor_id = $stmt_insert_autor->insert_id;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se pudo insertar el autor']);
        exit;
    }
    $stmt_insert_autor->close();
}
$stmt_autor->close();

// 1. Verificar si el libro existe en la base de datos
$check_libro_sql = "SELECT id FROM libros WHERE openlibrary_key = ?";
$stmt = $conexion->prepare($check_libro_sql);
$stmt->bind_param("s", $libro_key);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // El libro ya existe, obtener su ID
    $stmt->bind_result($libro_id);
    $stmt->fetch();
} else {
    // El libro no existe, insertarlo
    $insert_libro_sql = "INSERT INTO libros (openlibrary_key, titulo, autor_id, cover_id) VALUES (?, ?, ?, ?)";
    $insert_stmt = $conexion->prepare($insert_libro_sql);
    $insert_stmt->bind_param("ssii", $libro_key, $titulo, $autor_id, $cover_id);

    if ($insert_stmt->execute()) {
        $libro_id = $insert_stmt->insert_id;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se pudo insertar el libro en la base de datos']);
        exit;
    }
}

// 2. Verificar si ya está en la lista de deseos
$check_deseo_sql = "SELECT * FROM lista_deseos WHERE usuario_id = ? AND libro_id = ?";
$stmt_check_deseo = $conexion->prepare($check_deseo_sql);
$stmt_check_deseo->bind_param("ii", $usuario_id, $libro_id);
$stmt_check_deseo->execute();
$result = $stmt_check_deseo->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['status' => 'exists', 'message' => 'El libro ya está en la lista de deseos']);
    exit;
}

// 3. Insertar en la lista de deseos
$insert_deseo_sql = "INSERT INTO lista_deseos (usuario_id, libro_id) VALUES (?, ?)";
$stmt_insert_deseo = $conexion->prepare($insert_deseo_sql);
$stmt_insert_deseo->bind_param("ii", $usuario_id, $libro_id);

if ($stmt_insert_deseo->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Libro agregado a la lista de deseos']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo agregar el libro a la lista de deseos']);
}

$ia_id = isset($_POST['ia_id']) ? $_POST['ia_id'] : '';

// ...consulta si el libro ya existe...

if (!$existe_libro) {
    $stmt = $conexion->prepare("INSERT INTO libros (titulo, autor_id, cover_id, openlibrary_key, ia_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssiss", $titulo, $autor_id, $cover_id, $key, $ia_id);
    $stmt->execute();
}

// Cerrar conexiones
$stmt->close();
$stmt_check_deseo->close();
$stmt_insert_deseo->close();
$conexion->close();
?>
