<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recupera Contraseña</title>
    <link rel="stylesheet" href="../../public/assets/css/recupera_clave.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>

<body>
    <div class="container">
        <div class="login-section">
            <a href="../../public/login.php" class="back-button"><i class='bx bx-chevron-left'></i></a>
            <h1>Recuperar Contraseña</h1>
            <p>Recupera tu contraseña de <strong>Aeternum</strong> solo con tu correo, no dejes que un descuido te impida explorar mundos.</p>

            <form id="loginForm" action="../Utils/funcs.php" method="post">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required placeholder="hey@tuemail.com">
                    <p class="error-message" id="emailError"></p>
                </div>
                <button type="submit" class="login-button">Enviar Correo</button><br><br>
            </form>
        <div class="image-section">
            <img src="../../public/assets/img/recupera.jpg" alt="Img-biblioteca">
        </div>
    </div>

    <script src="../../public/assets/js/login.js"></script>
</body>
</html>