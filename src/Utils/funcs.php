<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\SMTP;

    require '../librerias/PHPMailer/src/Exception.php';
    require '../librerias/PHPMailer/src/PHPMailer.php';
    require '../librerias/PHPMailer/src/SMTP.php';

    include ("../../config/conexion.php");
    $email = $_POST['email'];
    
    $query = "SELECT * FROM usuarios WHERE correo = '$email'";
    $result = $conexion->query($query);

    if ($result->num_rows >0 ){
        $user = $result->fetch_assoc();
        $token = bin2hex(random_bytes(16)); // Generar token seguro
        $url = "http://localhost/Aeternum/src/Controllers/reset_password.php?token=" . $token;

        // Guardar token en la base de datos (deberías tener una tabla de recuperación)
        $insert = "INSERT INTO solicitudes_recuperacion_contrasena (usuario_id, token) VALUES ('{$user['id']}', '$token')";
        $conexion->query($insert);

        // Enviar el correo
        $mail = new PHPMailer(true);
        $mail->CharSet = 'UTF-8';

        try {
            $mail->isSMTP();                                            
            $mail->Host       = 'smtp.gmail.com';                
            $mail->SMTPAuth   = true;                                   
            $mail->Username   = 'aeternum538@gmail.com';                    
            $mail->Password   = 'wuby uikp lilt rfkq';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;   // ENCRYPTION_STARTTLS indica que se usará cifrado TLS para proteger la comunicación                            
            $mail->Port       = 587;  // Puerto 587 es el estándar para SMTP seguro con STARTTLS                    

            $mail->setFrom('aeternum538@gmail.com', 'Aeternum');
            $mail->addAddress($email);
            
            $mail->isHTML(true);                                  
            $mail->Subject = 'Recuperación de Contraseña';
            $mail->Body    = "Hola {$user['nombre']} {$user['apellido']},<br><br>Para restablecer tu contraseña haz clic en el siguiente enlace:<br><a href='$url'>$url</a><br><br>Si no solicitaste este correo, puedes ignorarlo.";

            $mail->send();
            echo 'Correo enviado, revisa tu bandeja de entrada.';
    } catch (Exception $e) {
        echo "El mensaje no pudo enviarse. Error: {$mail->ErrorInfo}";
    }

    } else {
        header("Location: ../../public/login.php");
    }