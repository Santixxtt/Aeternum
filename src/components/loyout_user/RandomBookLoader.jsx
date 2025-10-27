import { useState, useEffect } from 'react';
import Recomendados from './Recomendados'; 
import LoadingDots from '../loyout_reusable/LoadingDots'; 

export default function RandomBookLoader({ onAddToWishlist, onBorrow }) {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRecomendaciones = async () => {
      setLoading(true);
      setError(false);
      try {
        const queries = ["fantasy", "science", "love", "history", "mystery"];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        const res = await fetch(`https://openlibrary.org/search.json?q=${randomQuery}&limit=12`);

        
        if (!res.ok) {
          throw new Error('Error de red o servidor al cargar libros.');
        }

        const data = await res.json();
        setLibros(data.docs || []);
        
      } catch (e) {
        console.error("Error al cargar recomendaciones:", e);
        setError(true);
        
      } finally {
        setLoading(false);
      }
    };

    fetchRecomendaciones();
  }, []); 

  return (
    <section className="dashboard-user">
        <div className="text-center">
            <span className="dashboard-user mi-span">*</span>
            <h2 className="p-32">Recomendaciones para ti</h2>
        </div>
      
      {loading && (
        <div className="text-center py-10 loading-area">
          <LoadingDots />
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-red-600">
          <p>Lo sentimos, no pudimos cargar las recomendaciones.</p>
          <p>Verifica tu conexión a internet o inténtalo más tarde.</p>
        </div>
      )}

      {!loading && !error && libros.length === 0 && (
        <div className="text-center py-10">No hay recomendaciones disponibles en este momento.</div>
      )}

      {/* Solo renderiza la lista si no está cargando, no hay error, y hay libros */}
      {!loading && !error && libros.length > 0 && (
        <Recomendados 
          libros={libros} 
          onAddToWishlist={onAddToWishlist} 
          onBorrow={onBorrow} 
        />
      )}
    </section>
  );
}