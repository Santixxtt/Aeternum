import { useState } from "react";
import BookModal from "./BookModal";
import defaultImage from "../../assets/img/book-placeholder.png";

const BookCard = ({ book, onAddToWishlist }) => {
  const [open, setOpen] = useState(false);

  const initialSrc = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : defaultImage;

  return (
    <>
      {/* Carta del libro */}
      <div
        onClick={() => setOpen(true)}
        className="dashboard-user book-card cursor-pointer"
      >
        <img
          src={initialSrc}
          alt={book.title}
          onError={(e) => {
            if (e.target.src !== defaultImage) {
              e.target.src = defaultImage; // Si falla la imagen de la API, usa la imagen por defecto
            }
          }}
        />
        <h3>{book.title}</h3>
        <p>{book.author_name?.[0] || "Autor desconocido"}</p>
      </div>

      {/* Modal */}
      {open && (
        <BookModal
          book={book}
          onClose={() => setOpen(false)}
          onAddToWishlist={onAddToWishlist}
        />
      )}
    </>
  );
};

export default BookCard;