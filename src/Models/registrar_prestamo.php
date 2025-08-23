<?php
// session_start();
// if (!isset($_SESSION['id_usuario'])) {
//     echo json_encode(['status' => 'error', 'message' => 'No autenticado']);
//     exit;
// }

// include("../../config/conexion.php");

// $id_usuario = $_SESSION['id_usuario'];
// $id_libro = isset($_POST['libro_id']) ? intval($_POST['libro_id']) : 0;

// if ($id_libro <= 0) {
//     echo json_encode(['status' => 'error', 'message' => 'ID de libro inválido']);
//     exit;
// }

// // Verificar cantidad de préstamos activos
// $sql = "SELECT COUNT(*) AS total FROM prestamos WHERE usuario_id = ? AND estado = 'activo'";
// $stmt = $conexion->prepare($sql);
// $stmt->bind_param("i", $id_usuario);
// $stmt->execute();
// $result = $stmt->get_result();
// $row = $result->fetch_assoc();
// $total = $row['total'];
// $stmt->close();

// if ($total >= 4) {
//     echo json_encode(['status' => 'limit', 'message' => 'Ya tienes el máximo de 4 préstamos activos']);
//     exit;
// }

// // Registrar el préstamo
// $sqlInsert = "INSERT INTO prestamos (usuario_id, libro_id, fecha_prestamo, estado) VALUES (?, ?, NOW(), 'activo')";
// $stmtInsert = $conexion->prepare($sqlInsert);
// $stmtInsert->bind_param("ii", $id_usuario, $id_libro);
// if ($stmtInsert->execute()) {
//     echo json_encode(['status' => 'success', 'message' => 'Préstamo registrado exitosamente']);
// } else {
//     echo json_encode(['status' => 'error', 'message' => 'Error al registrar el préstamo']);
// }
// $stmtInsert->close();
// $conexion->close();
?>
