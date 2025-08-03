<?php
session_start();
header('Content-Type: application/json');

include("../../config/conexion.php");

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado']);
    exit;
}

if (!isset($_POST['libro_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID del libro no recibido']);
    exit;
}

$usuario_id = $_SESSION['id_usuario'];
$libro_id = intval($_POST['libro_id']);

$sql = "DELETE FROM lista_deseos WHERE usuario_id = ? AND libro_id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ii", $usuario_id, $libro_id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Libro eliminado de la lista de deseos']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo eliminar el libro']);
}

$stmt->close();
$conexion->close();
?>
