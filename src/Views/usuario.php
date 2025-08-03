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
    <title>Aeternum - Tu Biblioteca Digital</title>
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
                        <li><a href="usuario.php">Inicio</a></li>
                        <li><a href="catalogo.html">Catálogo</a></li>
                        <li><a href="../Models/lista_deseos.php">Lista de Deseos</a></li>
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
                            <a href="../Controllers/logout.php">
                                <i class='bxr  bx-arrow-left-stroke-square'></i>Salir<br>
                            </a>
                            <a href="#">
                                <i class='bxr  bx-pen-draw'></i>Perfil
                            </a>
                        </div>
                </div>
                
            </div>
        </div>
    
        <div id="resultados" class="search-fullscreen"></div>
    
        <section class="hero" id="bienvenida">
            <div>
                <h1>Bienvenid@ <?php echo utf8_decode($row['nombre']. ' '.$row['apellido']); ?></h1>
                <p>¡Listo para leer! Elige tu próxima historia, sumérgete en mundos desconocidos, recorre paisajes mágicos,
                    y déjate llevar por personajes inolvidables. A través de la lectura, se abre una puerta a nuevas ideas,
                    emociones y aventuras que esperan ser descubiertas. No es solo leer, es vivir mil vidas desde la
                    comodidad de tus propios pensamientos. ¡Empieza ahora tu viaje hacia lo extraordinario!</p>
                <a href="#" class="cta-button">Mira tu lista de deseos</a><br><br><br>
    
                <!-- NUEVO CONTENIDO: Recomendaciones -->
                <section class="user-books">
                    <div class="titulo-con-asterisco">
                        <span class="span-asterisco">*</span>
                        <h2>Recomendados para ti</h2>
                    </div>

                    <div class="book-grid" id="recomendados-grid">
                        <!-- Aquí se cargarán los libros recomendados desde la API -->
                    </div>
                </section>
    </div>
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

            <script src="../../public/assets/js/usuario.js"></script>
            <!-- Script para cargar libros recomendados desde la API -->
           <script>
// FUNCIÓN PARA CARGAR RECOMENDACIONES DESDE OPENLIBRARY
async function cargarRecomendados() {
    const grid = document.getElementById('recomendados-grid');
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div><p>Cargando recomendaciones...</p></div>';

    try {
        const response = await fetch('https://openlibrary.org/search.json?q=book&limit=30');
        const data = await response.json();

        let libros = data.docs.filter(b => b.cover_i && b.title && b.author_name);
        libros = libros.sort(() => 0.5 - Math.random()).slice(0, 12);

        let html = '';
        libros.forEach(book => {
            const imageUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
            let pdfLink = '';

            if (book.ia && book.ia.length > 0) {
                pdfLink = `https://archive.org/download/${book.ia[0]}/${book.ia[0]}.pdf`;
            } else if (book.ebook_access === 'public' && book.has_fulltext) {
                pdfLink = `https://openlibrary.org${book.key}/pdf`;
            }

            // Creamos cada tarjeta de libro con el botón estrella y su data-libro
            html += `
                <div class="book-card">
                    <img src="${imageUrl}" alt="${book.title}" onerror="this.onerror=null;this.src='../styles/img/no-cover.png';">
                    <h4>${book.title}</h4>
                    <p>${book.author_name.join(', ')}</p>
                    <div class="book-actions">
                        <div class="top-actions">
                            ${pdfLink ? `<a href="${pdfLink}" class="action-button" target="_blank" title="Descargar PDF"><i class='bxr bx-arrow-down-stroke-circle'></i></a>` : ''}
                            <button class="action-button star-button" title="Agregar a lista de deseos"
                                data-libro='${JSON.stringify({
                                    key: book.key,
                                    title: book.title,
                                    author_name: book.author_name,
                                    cover_i: book.cover_i || 0
                                }).replace(/'/g, "&apos;")}'>
                                <i class='bxr  bx-star' ></i> 
                            </button>
                        </div>
                        <a href="https://openlibrary.org${book.key}/borrow" target="_blank" class="action-button loan-button" title="Pedir Préstamo" style="text-decoration:none;">
                            Préstamelo
                        </a>
                        <div class="comment-box">
                            <input type="text" class="comment-input" placeholder="Escribe un comentario...">
                        </div>
                </div>
            </div>
            `;
        });

        grid.innerHTML = html;

        // ACTIVAR EVENTOS DE LAS ESTRELLAS ⭐
        document.querySelectorAll('#recomendados-grid .star-button').forEach(btn => {
            btn.addEventListener('click', function() {
                const libroData = JSON.parse(this.getAttribute('data-libro').replace(/&apos;/g, "'"));
                console.log('Libro data:', libroData);  // Verifica que los datos son correctos
                agregarListaDeseos(libroData, this);
            });
        });

        // ANIMACIÓN DE BOTONES AL CLIC
        document.querySelectorAll('#recomendados-grid .action-button').forEach(btn => {
            btn.addEventListener('click', function() {
                btn.classList.add('action-animate');
                setTimeout(() => btn.classList.remove('action-animate'), 200);
            });
        });

    } catch (error) {
        console.error('Error cargando recomendaciones:', error);
        grid.innerHTML = '<p>No se pudieron cargar recomendaciones.</p>';
    }
}

// FUNCIÓN PARA AGREGAR LIBRO A LA LISTA DE DESEOS (AJAX)
function agregarListaDeseos(book, btn) {
    // Deshabilitar el botón para evitar múltiples clics
    btn.disabled = true;

    fetch('../Models/agregar_deseo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `libro_key=${encodeURIComponent(book.key)}&titulo=${encodeURIComponent(book.title)}&autor=${encodeURIComponent(book.author_name.join(', '))}&cover_id=${book.cover_i || 0}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const icon = btn.querySelector('i');
            // Verifica si el ícono tiene la clase correcta
            console.log('Icono actual:', icon.classList);

            // Si el libro se agregó a la lista, cambiar la estrella vacía a llena
            icon.classList.replace('bx-star', 'bxs-star');
            btn.classList.add('star-active');  // Marca el botón como activo
            alert('Libro agregado a la lista de deseos');
        } else if (data.status === 'exists') {
            alert('Este libro ya está en tu lista de deseos');
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error al agregar a la lista de deseos:', error);
    })
    .finally(() => {
        // Volver a habilitar el botón después de la respuesta
        btn.disabled = false;
    });
}

// EJECUTAR AL CARGAR LA PÁGINA
window.addEventListener('DOMContentLoaded', cargarRecomendados);

//Función para la caja de comentarios
const card = e.target.closest('.book-card');
if (card && (e.target.tagName === 'IMG' || e.target.tagName === 'H4')) {
    card.classList.toggle('active');
}

// Enviar comentario al presionar Enter
document.addEventListener('keypress', function(e) {
    if (e.target.classList.contains('comment-input') && e.key === 'Enter') {
        const comment = e.target.value.trim();
        const libroKey = e.target.closest('.book-card').dataset.libroKey;

        if (comment !== '') {
            fetch('../Utils/guardar_comentario.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ libro_key: libroKey, comentario: comment })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Comentario guardado!');
                    e.target.value = '';
                    e.target.closest('.book-card').classList.remove('active');
                } else {
                    alert('Error al guardar comentario');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }
});

</script>
    </body>
</html>