import { useState } from "react";
import BookModal from "./BookModal";

const BookCard = ({ book, onAddToWishlist }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Carta del libro */}
      <div
        onClick={() => setOpen(true)}
        className="dashboard-user book-card cursor-pointer"
      >
        <img
          src={
            book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
              : "https://via.placeholder.com/150x220?text=Sin+Portada"
          }
          alt={book.title}
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
