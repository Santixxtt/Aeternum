<?php
session_start();
if (!isset($_SESSION['id_usuario'])) {
    header("Location: ../../public/index.html");
 exit;
}

include("../../config/conexion.php");

?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../public/assets/css/catalogo.css">
    <link href='https://cdn.boxicons.com/fonts/basic/boxicons.min.css' rel='stylesheet'>
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
    <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">
    
    <title>Catalogo</title>
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
                        <li><a href="catalogo.php">Catálogo</a></li>
                        <li><a href="../Models/lista_deseos.php">Lista de Deseos</a></li>
                        <li>
                        <div class="search-bar">
                            <i class='bx bx-search-alt'></i>
                            <input type="text" id="catalogoSearch" placeholder="Buscar en catálogo...">
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
    
        <section id="catalogo">
            <div class="catalogo-filtros">
                <select id="filtroAutor">
                    <option value="">Todos los autores</option>
                </select>
                <select id="filtroAnio">
                    <option value="">Todos los años</option>
                </select>
            </div>
            <div id="catalogo-grid" class="catalogo-grid"></div>
            <div id="catalogo-grid" class="catalogo-grid"></div>
            <div id="catalogo-paginacion" class="catalogo-paginacion"></div>

        </section>

       
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
            <script src="../../public/assets/js/catalogo.js"></script>
    </body>
</html>