<?php
    session_start();
    if(!isset($_SESSION['id_usuario'])){
        header("Location: ../../public/index.html");
    }

    include("../../config/conexion.php");
    $id_user = $_SESSION['id_usuario'];
    $sql = "SELECT id, nombre, apellido FROM usuarios WHERE id = '$id_user'";
    $resultado = $conexion->query($sql);
    $row = $resultado->fetch_assoc();
?>


<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../public/assets/css/usuario.css">
    <link href='https://cdn.boxicons.com/fonts/basic/boxicons.min.css' rel='stylesheet'>
    <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">
    
    <title>Aeternum - Tu Biblioteca Digital</title>
</head>

<body>
    <div class="homecontent">
        <div class="header" id="navbar" data-aos="fade-down" data-aos-duration="800">
            <div class="header-content">
                <div class="logo" data-aos="zoom-in" data-aos-duration="800">
                    <img src="../../public/assets/img/aeternum_logo.png" alt="logo">
                </div>

                <div class="nav-toggle" id="menuToggle" data-aos="fade-left" data-aos-duration="800">
                    <i class='bx bx-menu' id="menu-icon"></i>
                </div>

                <nav class="nav" id="nav-menu" data-aos="fade-left" data-aos-duration="800">
                    <ul id="menuList">
                        <li><a href="usuario.php">Inicio</a></li>
                        <li><a href="catalogo.html">Catálogo</a></li>
                        <li><a href="../Models/lista_deseos.php">Lista de Deseos</a></li>
                        <li>
                        <div class="search-bar">
                            <i class='bx bx-search-alt'></i>
                            <input type="text" id="searchInput" placeholder="Buscar libros...">
                        </div>
                        </li>
                        <li class="user-menu">
                        <div class="user-icon" id="userIcon">
                            <i class='bx bx-user-circle'></i>
                        </div>
                        <ul class="dropdown" id="dropdownMenu">
                            <li>
                                <a href="../Controllers/logout.php">
                                    <i class='bx bx-log-out'></i> Salir
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i class='bx bx-user'></i> Perfil
                                </a>
                            </li>
                        </ul>
                        </li>
                    </ul>
                </nav>
                </div>
            </div>
        </div>
    
        <div id="resultados" class="search-fullscreen"></div>
    
        <section class="hero" id="bienvenida">
            <div>
                <h1 data-aos="fade-down" data-aos-duration="800">Bienvenid@ <?php echo utf8_decode($row['nombre']. ' '.$row['apellido']); ?></h1>
                <p data-aos="fade-up" data-aos-duration="800">¡Listo para leer! Elige tu próxima historia, sumérgete en mundos desconocidos, recorre paisajes mágicos,
                    y déjate llevar por personajes inolvidables. A través de la lectura, se abre una puerta a nuevas ideas,
                    emociones y aventuras que esperan ser descubiertas. No es solo leer, es vivir mil vidas desde la
                    comodidad de tus propios pensamientos. ¡Empieza ahora tu viaje hacia lo extraordinario!</p>
                <a href="../Models/lista_deseos.php" class="cta-button" data-aos="zoom-in" data-aos-duration="800">Mira tu lista de deseos</a><br><br><br>
    
                <section class="user-books">
                    <div class="titulo-con-asterisco" data-aos="fade-down" data-aos-duration="800">
                        <span class="span-asterisco">*</span>
                        <h2>Recomendados para ti</h2>
                    </div>

                    <div class="book-grid" id="recomendados-grid">
                        </div>
                </section>
            </div>
            <footer class="footer" id="footer">
                <div class="footer-content">
                    <div class="footer-section" data-aos="fade-up" data-aos-duration="800">
                        <h3>AETERNUM.</h3>
                        <p>Tu espacio digital para explorar mundos literarios y expandir tu conocimiento.</p>
                    </div>
                    <div class="footer-section" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
                        <h3>Acerca de</h3>
                        <ul>
                            <li><a href="#">Equipo</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Contacto</a></li>
                        </ul>
                    </div>
                    <div class="footer-section" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
                        <h3>Privacidad</h3>
                        <ul>
                            <li><a href="../../public/politica_privacidad.html">Política de Privacidad</a></li>
                            <li><a href="#">Términos de Servicio</a></li>
                            <li><a href="#">Ayuda</a></li>
                        </ul>
                    </div>
                    <div class="footer-section" data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
                        <h3>Social</h3>
                        <ul>
                            <li><a href="#">Facebook</a></li>
                            <li><a href="#">Twitter</a></li>
                            <li><a href="#">Instagram</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom" data-aos="fade-up" data-aos-duration="800">
                    <p>&copy; <span id="year"></span> Aeternum. Todos los derechos reservados.</p>
                </div>
            </footer>

            <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
            <script>
                AOS.init();
                
                // Función para establecer el año en el footer
                const setFooterYear = () => {
                    const yearElement = document.getElementById('year');
                    if (yearElement) {
                        yearElement.textContent = new Date().getFullYear();
                    }
                };
                
                // Llama a la función al cargar el DOM
                document.addEventListener('DOMContentLoaded', setFooterYear);
            </script>
            <script src="../../public/assets/js/usuario.js"></script>
            <script src="../../public/assets/js/recomendaciones.js"></script>
    </body>
</html>