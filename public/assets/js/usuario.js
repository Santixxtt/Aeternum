// usuario.js

// Sticky Header
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
});


// Dropdown perfil por click (sin :hover)
const userMenu  = document.querySelector('.user-menu');
const userIcon  = userMenu?.querySelector('#userIcon');
const dropdown  = userMenu?.querySelector('#dropdownMenu');

if (userIcon && dropdown) {
  // Asegura oculto al iniciar (anti-parpadeo, por si hay estilos inline previos)
  dropdown.style.opacity = '';
  dropdown.style.visibility = '';
  dropdown.style.transform = '';

  userIcon.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    userMenu.classList.toggle('open');
  });

  // Cerrar al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!userMenu.contains(e.target)) userMenu.classList.remove('open');
  });

  // Cerrar con ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') userMenu.classList.remove('open');
  });
}


// Búsqueda OpenLibrary
const searchInput = document.getElementById('searchInput');
const resultados = document.getElementById('resultados');
const bienvenida = document.getElementById('bienvenida');
const footer = document.querySelector('.footer');

async function searchBooks(query) {
    try {
        resultados.innerHTML = `<div class="loader-container"><div class="loader"></div><p>Buscando libros...</p></div>`;
        resultados.classList.add('search-fullscreen');
        resultados.style.display = 'block';
        bienvenida.style.display = 'none';
        footer.style.display = 'none';

        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`);
        const data = await response.json();

        if (data.docs && data.docs.length > 0) {
            let html = '';
            data.docs.forEach(book => {
                const coverId = book.cover_i;
                const imageUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : '../styles/img/no-cover.png';
                let pdfLink = '';

                if (book.ia && book.ia.length > 0) {
                    pdfLink = `https://archive.org/download/${book.ia[0]}/${book.ia[0]}.pdf`;
                } else if (book.ebook_access === 'public' && book.has_fulltext) {
                    pdfLink = `https://openlibrary.org${book.key}/pdf`;
                }

                let titulo = book.title && book.title.length > 25 ? book.title.slice(0, 22) + '...' : book.title;
                let autores = book.author_name ? book.author_name.join(', ') : 'Autor desconocido';
                if (autores.length > 25) autores = autores.slice(0, 22) + '...';

                html += `
                    <div class="book-card">
                        <img src="${imageUrl}" alt="${titulo}" onerror="this.onerror=null;this.src='../styles/img/no-cover.png';">
                        <h4>${titulo}</h4>
                        <p>${autores}</p>
                        <div class="book-actions">
                            <div class="top-actions">
                                ${pdfLink ? `<a href="${pdfLink}" class="action-button" target="_blank" title="Descargar PDF"><i class='bxr  bx-arrow-down-stroke-circle'></i></a>` : ''}
                                <button class="action-button star-button" title="Agregar a lista de deseos"
                                    data-libro='${JSON.stringify({
                                        key: book.key,
                                        title: book.title,
                                        author_name: book.author_name,
                                        cover_i: book.cover_i || 0
                                    }).replace(/'/g, "&apos;")}' >
                                    <i class='bx bx-star'></i>
                                </button>
                            </div>
                            <a class="action-button loan-button" title="Pedir Préstamo"
                            data-libro="${JSON.stringify({
                                key: book.key,
                                title: book.title,
                                author_name: book.author_name,
                                cover_i: book.cover_i || 0
                            }).replace(/"/g, '&quot;')}"
                            data-openlibrary-url="https://openlibrary.org${book.key}/borrow">
                            Préstamelo
                            </a>
                        </a>
                        </div>
                    </div>
                `;
            });

            resultados.innerHTML = html;
            footer.style.display = 'block';

            // Activar listeners de botones estrella
            document.querySelectorAll('#resultados .star-button').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    const libroData = JSON.parse(this.getAttribute('data-libro').replace(/&apos;/g, "'"));
                    agregarListaDeseos(libroData, this);
                });
            });

            // ACTIVAR EVENTOS DEL BOTÓN DE PRÉSTAMO
            document.querySelectorAll('#resultados .loan-button').forEach(btn => {
                btn.addEventListener('click', function() {
                    const libroData = JSON.parse(this.getAttribute('data-libro').replace(/&apos;/g, "'"));
                    registrarPrestamo(libroData, this);
                });
            });

            document.querySelectorAll('#resultados .action-button').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    btn.classList.add('action-animate');
                    setTimeout(() => {
                        btn.classList.remove('action-animate');
                    }, 200);
                });
            });

        } else {
            resultados.innerHTML = '<p>No se encontraron resultados.</p>';
        }

    } catch (error) {
        console.error('Error al buscar libros:', error);
        resultados.innerHTML = '<p>Error al buscar libros. Inténtalo de nuevo.</p>';
    }
}

// Eventos de Búsqueda
let debounceTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    const query = searchInput.value.trim();
    if (query.length >= 3) {
        debounceTimeout = setTimeout(() => {
            searchBooks(query);
        }, 500);
    } else {
        resultados.style.display = 'none';
        bienvenida.style.display = 'block';
        footer.style.display = 'block';
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            searchBooks(query);
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchInput.value = '';
        resultados.style.display = 'none';
        bienvenida.style.display = 'block';
        footer.style.display = 'block';
    }
});


// Si el libro tiene la pripiedad Internet Archive, mostrar genera un enlace de descarga
//Si el libro tiene ebook_access: 'public' y has_fulltext: true, se genera un enlace al PDF en Open Library.
//Open Library solo marc public los libros que son de dominio publico o con derechos de distribución libre

//El flujo es:
//Cuando des clic en la estrella ⭐, se ejecuta un AJAX (fetch) desde tu JS.
//Este fetch llama a agregar_deseo.php (POST).
//PHP guarda en la base de datos.
//Opcional: Devuelve un mensaje de éxito/fallo.

// Función para agregar un libro a la lista de deseos

//funcion de al darle clic aparece la caja de comentarios
document.addEventListener('click', function(e) {
    const card = e.target.closest('.book-card');
    if (card && (e.target.tagName === 'IMG' || e.target.tagName === 'H4' || e.target.classList.contains('toggle-comment'))) {
        card.classList.toggle('active');
    }
});

// Enviar comentario al presionar Enter
document.addEventListener('keypress', function(e) {
    if (e.target.classList.contains('comment-input') && e.key === 'Enter') {
        const comment = e.target.value.trim();
        const libroKey = e.target.closest('.book-card').dataset.libroKey;

        if (comment !== '') {
            fetch('../../../src/Utils/guardar_comentario.php', {
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

// Menú para celular
const menuIcon = document.getElementById('menu-icon');
const navMenu = document.getElementById('nav-menu');

let menuOpen = false;

menuIcon.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuOpen = !menuOpen;

    // Cambiar ícono
    if (menuOpen) {
        menuIcon.classList.remove('bx-menu');
        menuIcon.classList.add('bx-menu-alt-right'); 
    } else {
        menuIcon.classList.remove('bx-menu-alt-right'); 
        menuIcon.classList.add('bx-menu');
    }
});
