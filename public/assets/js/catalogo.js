// ==================
// CONFIGURACIÓN DE PAGINACIÓN
// ==================
const LIBROS_POR_PAGINA = 12; // Define cuántos libros quieres por página
let paginaActual = 1;
let librosFiltrados = []; // Mantendrá los libros después de filtrar y buscar

// Sticky header
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
});

// ==================
// CATÁLOGO
// ==================
const catalogoGrid = document.getElementById('catalogo-grid');
const catalogoSearch = document.getElementById('catalogoSearch');
const filtroAutor = document.getElementById('filtroAutor');
const filtroAnio = document.getElementById('filtroAnio');
const paginacionContainer = document.getElementById('catalogo-paginacion'); // Elemento para los botones de paginación

let catalogoLibros = []; // Guarda la data original

async function cargarCatalogo(query = "book") {
    catalogoGrid.innerHTML = `<div class="loader-container"><div class="loader"></div><p>Cargando catálogo...</p></div>`;

    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=100`); // Aumentamos el límite para tener más libros para la paginación
        const data = await response.json();

        catalogoLibros = data.docs.filter(b => b.cover_i && b.title && b.author_name);
        librosFiltrados = [...catalogoLibros]; // Inicializa los libros filtrados con todos los libros

        renderCatalogo(librosFiltrados);
        poblarFiltros(catalogoLibros);
    } catch (error) {
        console.error('Error cargando catálogo:', error);
        catalogoGrid.innerHTML = '<p>No se pudo cargar el catálogo.</p>';
    }
}

function renderCatalogo(libros) {
    if (libros.length === 0) {
        catalogoGrid.innerHTML = '<p>No se encontraron libros.</p>';
        paginacionContainer.innerHTML = ''; // Limpiamos los botones de paginación
        return;
    }

    // Calcular el rango de libros a mostrar en la página actual
    const inicio = (paginaActual - 1) * LIBROS_POR_PAGINA;
    const fin = inicio + LIBROS_POR_PAGINA;
    const librosEnPagina = libros.slice(inicio, fin);

    let html = '';
    librosEnPagina.forEach(book => {
        const imageUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
        const titulo = book.title;
        const autores = book.author_name ? book.author_name.join(', ') : 'Autor desconocido';
        let pdfLink = '';
        if (book.ia && book.ia.length > 0) {
            pdfLink = `https://archive.org/download/${book.ia[0]}/${book.ia[0]}.pdf`;
        } else if (book.ebook_access === 'public' && book.has_fulltext) {
            pdfLink = `https://openlibrary.org${book.key}/pdf`;
        }

        html += `
        <div class="book-card">
            <img src="${imageUrl}" alt="${titulo}" onerror="this.onerror=null;this.src='../styles/img/no-cover.png';">
            <h4>${titulo}</h4>
            <p>${autores}</p>
            <div class="book-actions">
                <div class="top-actions">
                    ${pdfLink ? `<a href="${pdfLink}" class="action-button" target="_blank" title="Descargar PDF"><i class='bx bx-download'></i></a>` : ''}
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
                
                <a class="action-button loan-button"
                    data-libro="${JSON.stringify({
                        key: book.key,
                        title: book.title,
                        author_name: book.author_name,
                        cover_i: book.cover_i || 0
                    }).replace(/"/g, '&quot;')}"
                    data-openlibrary-url="https://openlibrary.org${book.key}/borrow">
                    Préstamelo
                </a>
            </div>
        </div>`;
    });

    catalogoGrid.innerHTML = html;
    renderPaginacion(libros.length); // Renderiza los botones de paginación
    
    // Agrega los event listeners
    document.querySelectorAll('#catalogo-grid .star-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const libroData = JSON.parse(this.getAttribute('data-libro').replace(/&apos;/g, "'"));
            agregarListaDeseos(libroData, this);
        });
    });

    document.querySelectorAll('#catalogo-grid .loan-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const libroData = JSON.parse(this.getAttribute('data-libro').replace(/&apos;/g, "'"));
            registrarPrestamo(libroData, this, this.dataset.openlibraryUrl);
        });
    });
}

// ==================
// FUNCIÓN DE PAGINACIÓN
// ==================
function renderPaginacion(totalLibros) {
    const totalPaginas = Math.ceil(totalLibros / LIBROS_POR_PAGINA);
    let html = '';

    // Botón "Anterior"
    html += `<button id="prev-page" class="pag-btn" ${paginaActual === 1 ? 'disabled' : ''}>&laquo;</button>`;

    // Botones de número de página
    for (let i = 1; i <= totalPaginas; i++) {
        html += `<button class="pag-btn ${i === paginaActual ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    // Botón "Siguiente"
    html += `<button id="next-page" class="pag-btn" ${paginaActual === totalPaginas ? 'disabled' : ''}>&raquo;</button>`;

    paginacionContainer.innerHTML = html;

    // Agregar listeners a los nuevos botones
    document.querySelectorAll('.pag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id === 'prev-page') {
                paginaActual--;
            } else if (btn.id === 'next-page') {
                paginaActual++;
            } else {
                paginaActual = parseInt(btn.dataset.page);
            }
            renderCatalogo(librosFiltrados); // Vuelve a renderizar el catálogo con la nueva página
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Mueve la vista al inicio del catálogo
        });
    });
}

// ==================
// FILTROS Y BÚSQUEDA
// ==================
function poblarFiltros(libros) {
    let autoresUnicos = [...new Set(libros.flatMap(b => b.author_name || []))].slice(0, 20);
    filtroAutor.innerHTML = '<option value="">Todos los autores</option>' + autoresUnicos.map(a => `<option>${a}</option>`).join('');

    let anios = [...new Set(libros.map(b => b.first_publish_year).filter(Boolean))].sort((a,b)=>b-a);
    filtroAnio.innerHTML = '<option value="">Todos los años</option>' + anios.map(y => `<option>${y}</option>`).join('');
}

catalogoSearch.addEventListener('input', filtrarCatalogo);
filtroAutor.addEventListener('change', filtrarCatalogo);
filtroAnio.addEventListener('change', filtrarCatalogo);

function filtrarCatalogo() {
    let libros = [...catalogoLibros]; // Empezamos con la lista completa

    const q = catalogoSearch.value.toLowerCase();
    if (q) {
        libros = libros.filter(b => b.title.toLowerCase().includes(q));
    }

    if (filtroAutor.value) {
        libros = libros.filter(b => b.author_name && b.author_name.includes(filtroAutor.value));
    }

    if (filtroAnio.value) {
        libros = libros.filter(b => b.first_publish_year == filtroAnio.value);
    }
    
    librosFiltrados = libros; // Actualizamos la lista filtrada
    paginaActual = 1; // Reseteamos la página a la primera
    renderCatalogo(librosFiltrados);
}

// ==================
// AJAX: DESEOS & PRÉSTAMOS
// ==================
function agregarListaDeseos(book, btn) {
    btn.disabled = true;

    fetch('../Models/agregar_deseo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `libro_key=${encodeURIComponent(book.key)}&titulo=${encodeURIComponent(book.title)}&autor=${encodeURIComponent(book.author_name.join(', '))}&cover_id=${book.cover_i || 0}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const icon = btn.querySelector('i');
            icon.classList.replace('bx-star', 'bxs-star');
            btn.classList.add('star-active');
            alert('Libro agregado a la lista de deseos');
        } else if (data.status === 'exists') {
            alert('Este libro ya está en tu lista de deseos');
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(err => console.error('Error al agregar a deseos:', err))
    .finally(() => { btn.disabled = false; });
}

function registrarPrestamo(book, btn, redirectUrl) {
    btn.disabled = true;
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>';

    fetch('../Models/registrar_prestamo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `libro_key=${encodeURIComponent(book.key)}&titulo=${encodeURIComponent(book.title)}&autor=${encodeURIComponent(book.author_name.join(', '))}&cover_id=${book.cover_i || 0}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            alert('¡Préstamo registrado! Redirigiendo...');
            window.location.href = redirectUrl;
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(err => console.error('Error préstamo:', err))
    .finally(() => {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    });
}

// ==================
// MENÚ RESPONSIVE
// ==================
const menuIcon = document.getElementById('menu-icon');
const navMenu = document.getElementById('nav-menu');

let menuOpen = false;
menuIcon.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuOpen = !menuOpen;
    if (menuOpen) {
        menuIcon.classList.remove('bx-menu');
        menuIcon.classList.add('bx-menu-alt-right');
    } else {
        menuIcon.classList.remove('bx-menu-alt-right');
        menuIcon.classList.add('bx-menu');
    }
});

// ==================
// INIT
// ==================
document.addEventListener('DOMContentLoaded', () => cargarCatalogo());