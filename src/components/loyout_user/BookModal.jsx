import { useEffect, useState } from "react";

export default function BookModal({ book, onClose, onAddToWishlist }) {
  const [description, setDescription] = useState("Cargando resumen...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://openlibrary.org${book.key}.json`);
        const data = await res.json();
        if (data.description) {
          setDescription(
            typeof data.description === "string"
              ? data.description
              : data.description.value
          );
        } else {
          setDescription("No hay resumen disponible.");
        }
      } catch (err) {
        setDescription("Error al cargar resumen.");
      } finally {
        setLoading(false);
      }
    };

    if (book?.key) {
      fetchDescription();
    }
  }, [book]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>

        <div className="modal-body">
          {/* Imagen */}
          <div className="modal-image">
            <img
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                  : "https://via.placeholder.com/200x300?text=Sin+Portada"
              }
              alt={book.title}
            />
          </div>

          {/* Info */}
          <div className="modal-info">
            <h2>{book.title}</h2>
            <p>
              <strong>Autor:</strong> {book.author_name?.[0] || "Desconocido"}
            </p>

            {/* Estrellas mock */}
            <div className="stars">⭐⭐⭐⭐☆</div>

            {/* Resumen */}
            <div className="modal-description">
              <h3>Resumen</h3>
              <p>{loading ? "Cargando..." : description}</p>
            </div>

            {/* Comentarios */}
            <div className="modal-comments">
              <h3>Comentarios</h3>
              <p>
                (Comentarios falta conectar base de datos)
              </p>
            </div>

            {/* Botones de acción */}
            <div className="modal-actions">
              <button onClick={() => console.log("Préstamo físico")}>
                📚 Préstamo Físico
              </button>
              <button
                onClick={() =>
                  window.open(`https://openlibrary.org${book.key}`, "_blank")
                }
              >
                💻 Préstamo Digital
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://openlibrary.org${book.key}/borrow`,
                    "_blank"
                  )
                }
              >
                ⬇ Descargar
              </button>
              <button onClick={() => onAddToWishlist(book)}>⭐ Deseos</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
