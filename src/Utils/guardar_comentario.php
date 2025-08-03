<?php
session_start();
if(!isset($_SESSION['id_usuario'])){
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

include("../../config/conexion.php");

$data = json_decode(file_get_contents("php://input"), true);
$libro_key = $data['libro_key'];
$comentario = $data['comentario'];
$id_usuario = $_SESSION['id_usuario'];

// Guardar el comentario
$stmt = $conexion->prepare("INSERT INTO comentarios (libro_key, id_usuario, comentario) VALUES (?, ?, ?)");
$stmt->bind_param("sis", $libro_key, $id_usuario, $comentario);

if($stmt->execute()){
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al guardar']);
}

$stmt->close();
$conexion->close();
?>
