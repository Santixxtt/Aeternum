import BookCard from "./BookCard";

export default function Recomendados({ libros, onAddToWishlist, onBorrow }) {
  if (!libros || libros.length === 0) {
    return <div className="text-center py-10">No hay recomendaciones.</div>;
  }

  return (
    <section className="dashboard-user dashboard-book-list">
      {/* <h2>Recomendaciones para ti</h2> */}
  {libros.map((book, index) => (
    <BookCard
      key={index}
      book={book}
      onAddToWishlist={onAddToWishlist}
      onBorrow={onBorrow}
    />
  ))}
</section>

  );
}
