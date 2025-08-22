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
                                <i class='bxr bx-star'></i>
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
                console.log('Libro data:', libroData);
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
            icon.classList.replace('bx-star', 'bxs-star');
            btn.classList.add('star-active');
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
        btn.disabled = false;
    });
}

// EJECUTAR AL CARGAR LA PÁGINA
window.addEventListener('DOMContentLoaded', cargarRecomendados);

// Función para la caja de comentarios
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

// --- LÓGICA PARA EL BOTÓN DE DESCARGA EN LA LISTA DE DESEOS ---

// Función para manejar la descarga del PDF
async function handleDownload(event) {
    const button = event.currentTarget;
    const openlibraryKey = button.getAttribute('data-key');
    
    // Deshabilitar el botón y mostrar un indicador de carga
    button.disabled = true;
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>';

    try {
        const response = await fetch(`https://openlibrary.org/api/books.json?bibkeys=OLID:${openlibraryKey.replace('/works/', '')}`);
        const data = await response.json();
        
        const bookData = data[`OLID:${openlibraryKey.replace('/works/', '')}`];
        if (bookData && bookData.details) {
            let pdfLink = '';

            // Lógica para encontrar el PDF (similar a las recomendaciones)
            if (bookData.details.ia && bookData.details.ia.length > 0) {
                pdfLink = `https://archive.org/download/${bookData.details.ia[0]}/${bookData.details.ia[0]}.pdf`;
            } else if (bookData.details.ebook_access === 'public' && bookData.details.has_fulltext) {
                pdfLink = `https://openlibrary.org${openlibraryKey}/pdf`;
            }

            if (pdfLink) {
                window.open(pdfLink, '_blank');
            } else {
                alert('No se encontró un archivo PDF para este libro.');
            }
        } else {
            alert('No se encontró información para la descarga.');
        }

    } catch (error) {
        console.error('Error al obtener el enlace de descarga:', error);
        alert('Hubo un error al intentar descargar el libro.');
    } finally {
        // Habilitar el botón y restaurar el contenido original
        button.disabled = false;
        button.innerHTML = originalContent;
    }
}

// Asegurar que el DOM esté completamente cargado antes de añadir los escuchadores
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.download-button').forEach(button => {
        button.addEventListener('click', handleDownload);
    });
});