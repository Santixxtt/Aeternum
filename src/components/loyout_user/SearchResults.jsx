import BookCard from "./BookCard";

export default function SearchResults({ libros, loading, onAddToWishlist, onBorrow }) {
  if (loading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  if (!libros || libros.length === 0) {
    return <div className="text-center py-10">No se encontraron resultados.</div>;
  }

  return (
    <section className="dashboard-user dashboard-book-list">
      <h2>Resultados</h2>
      <div>
        {libros.map((book) => (
          <BookCard
            key={book.key}
            book={book}
            onAddToWishlist={onAddToWishlist}
            onBorrow={onBorrow}
          />
        ))}
      </div>
    </section>
  );
}
