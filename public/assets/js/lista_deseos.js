document.addEventListener('DOMContentLoaded', () => {
    // Eliminar de lista de deseos
    document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', function(event) {
            const libroId = this.getAttribute('data-id');
            
            if (libroId) {
                if (confirm('¿Seguro que deseas quitar este libro de la lista de deseos?')) {
                    fetch('eliminar_deseo.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: `libro_id=${libroId}`
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            const bookCard = this.closest('.book-card');
                            bookCard.remove();
                        } else {
                            alert('Error al eliminar: ' + data.message);
                        }
                    })
                    .catch(err => console.error('Error:', err));
                }
                event.stopPropagation();
            }
        });
    });

});

function agregarListaDeseos(book, btn) {
    fetch('agregar_deseo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `libro_key=${encodeURIComponent(book.key)}&titulo=${encodeURIComponent(book.title)}&autor=${encodeURIComponent(book.author_name.join(', '))}&cover_id=${book.cover_i || 0}&ia_id=${book.ia ? book.ia[0] : ''}`
    })
    .then(response => response.json())
    .then(data => {
    });
}

