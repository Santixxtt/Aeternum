    <?php
    session_start();
    if (!isset($_SESSION['id_usuario'])) {
        header("Location: ../../public/index.html");
        exit;
    }

    include("../../config/conexion.php");

    $usuario_id = $_SESSION['id_usuario'];

    // Consulta para obtener los libros en la lista de deseos del usuario por id
    $sql = "SELECT libros.id, libros.titulo, libros.cover_id, libros.openlibrary_key, autores.nombre AS autor
            FROM lista_deseos
            INNER JOIN libros ON lista_deseos.libro_id = libros.id
            INNER JOIN autores ON libros.autor_id = autores.id
            WHERE lista_deseos.usuario_id = ?";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();


    $libros = [];
    while ($row = $result->fetch_assoc()) {
        $libros[] = $row;
    }

    $stmt->close();
    $conexion->close();
    ?>

    <!DOCTYPE html>
    <html lang="es">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../../public/assets/css/lista_deseos.css">
        <link href='https://cdn.boxicons.com/fonts/basic/boxicons.min.css' rel='stylesheet'>
        <title>Mi Lista de Deseos</title>
    </head>

    <body>
        <div class="homecontent">
            <div class="header" id="navbar">
                <div class="header-content">
                    <div class="logo">
                        <img src="../../public/assets/img/aeternum_logo.png" alt="" placeholder="logo">
                    </div>
                    <nav class="nav">
                        <ul>
                            <li><a href="../Views/usuario.php">Inicio</a></li>
                            <li><a href="../Views/catalogo.html">Catálogo</a></li>
                            <li><a href="lista_deseos.php">Lista de Deseos</a></li>
                            <li><a href="#">Contacto</a></li>
                        </ul>
                    </nav>
                    <div class="search-bar">
                        <i class='bxr bx-search-alt'></i>
                        <input type="text" id="searchInput" placeholder="Buscar libros...">
                    </div>
                    
                    <div class="user-icon" id="userIcon">
                        <i class='bx bx-user-circle'></i>
                        <div class="dropdown" id="dropdownMenu">
                            <a href="logout.php">
                                <i class='bxr  bx-arrow-left-stroke-square'></i>Salir<br>
                            </a>
                            <a href="#">
                                <i class='bxr  bx-pen-draw'></i>Perfil
                            </a>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div class="titulo-con-asterisco">
                <h2>Mi Lista de Deseos</h2>
                <span class="span-asterisco">*</span>
            </div>
            <p class="descripcion">Aquí puedes ver todos los libros que has añadido a tu lista de deseos. Puedes eliminarlos si ya no te interesan.</p>
        <?php if (count($libros) > 0): ?>
    <div class="deseos-grid">
    <?php foreach ($libros as $libro): ?>
        <div class="book-card">
            <img src="https://covers.openlibrary.org/b/id/<?php echo $libro['cover_id']; ?>-M.jpg" alt="<?php echo htmlspecialchars($libro['titulo']); ?>">
            <h4><?php echo htmlspecialchars($libro['titulo']); ?></h4>
            <p><?php echo htmlspecialchars($libro['autor']); ?></p>
            <div class="book-actions">
                <div class="top-actions">
                    <button class="action-button remove-button star-active" data-id="<?php echo $libro['id']; ?>" title="Quitar de Lista de Deseos">
                        <i class='bx bxs-star'></i>
                    </button>
                        <a href="https://openlibrary.org<?php echo $libro['openlibrary_key']; ?>/pdf" class="action-button" target="_blank" title="Descargar PDF">
                            <i class='bxr bx-arrow-down-stroke-circle'></i>
                        </a>

                </div>
                <a href="https://openlibrary.org<?php echo $libro['openlibrary_key']; ?>/borrow" target="_blank" class="action-button loan-button" title="Pedir Préstamo">
                    Préstamelo
                </a>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<?php else: ?>
    <p>No tienes libros en tu lista de deseos.</p>
<?php endif; ?>


        <footer class="footer">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h3>AETERNUM.</h3>
                            <p>Tu espacio digital para explorar mundos literarios y expandir tu conocimiento.</p>
                        </div>
                        <div class="footer-section">
                            <h3>Acerca de</h3>
                            <ul>
                                <li><a href="#">Equipo</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Contacto</a></li>
                            </ul>
                        </div>
                        <div class="footer-section">
                            <h3>Privacidad</h3>
                            <ul>
                                <li><a href="#">Política de Privacidad</a></li>
                                <li><a href="#">Términos de Servicio</a></li>
                                <li><a href="#">Ayuda</a></li>
                            </ul>
                        </div>
                        <div class="footer-section">
                            <h3>Social</h3>
                            <ul>
                                <li><a href="#">Facebook</a></li>
                                <li><a href="#">Twitter</a></li>
                                <li><a href="#">Instagram</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="footer-bottom">
                        <p>&copy; <span id="year"></span> Aeternum. Todos los derechos reservados.</p>
                    </div>

                    <script>
                        document.getElementById("year").textContent = new Date().getFullYear();
                    </script>
                </footer>

        <script src="../../public/assets/js/lista_deseos.js"></script>
        <script src="../../public/assets/js/usuario.js"></script>
    </body>
    </html>
