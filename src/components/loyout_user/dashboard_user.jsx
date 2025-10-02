import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "../loyout_reusable/footer";
import SearchResults from "./SearchResults";
import Recomendados from "./Recomendados";
import "../../assets/css/dashboard_user.css";

export default function DashboardUser() {
  const [usuario, setUsuario] = useState(null);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recomendados, setRecomendados] = useState([]);
  const navigate = useNavigate();

  // Redirigir si no hay token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // Cargar datos del usuario y recomendaciones
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://127.0.0.1:8000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsuario(data))
      .catch((err) => console.error(err));

    fetch("https://openlibrary.org/search.json?q=book&limit=10")
      .then((res) => res.json())
      .then((data) => setRecomendados(data.docs || []));
  }, []);

  const searchBooks = async (q) => {
    if (!q || q.length < 3) {
      setResultados([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=20`
      );
      const data = await res.json();
      setResultados(data.docs || []);
    } catch (error) {
      console.error("Error al buscar libros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = (book) => {
    console.log("Añadir a lista de deseos:", book);
    // Aquí podrías hacer un fetch a tu backend
  };

  const handleBorrow = (book) => {
    console.log("Pedir prestado:", book);
    // Aquí podrías hacer un fetch a tu backend
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-user">
      <Header
        onSearch={(q) => {
          setQuery(q);
          searchBooks(q);
        }}
        onLogout={handleLogout}
      />

      <main>
        {usuario && (
          <section className="dashboard-user dashboard-hero">
            <h1>Bienvenid@ {usuario.nombre} {usuario.apellido}</h1>
            <p>
              ¡Listo para leer! Elige tu próxima historia, sumérgete en mundos desconocidos,
              recorre paisajes mágicos, y déjate llevar por personajes inolvidables. A través de la lectura,
              se abre una puerta a nuevas ideas, emociones y aventuras que esperan ser descubiertas.
              No es solo leer, es vivir mil vidas desde la comodidad de tus propios pensamientos.
              ¡Empieza ahora tu viaje hacia lo extraordinario!
            </p>
            <a href="#" className="cta-button" data-aos="zoom-in">
              Mira tu Lista de Deseos
            </a>
          </section>
        )}

        {query.length >= 3 ? (
          <SearchResults
            libros={resultados}
            loading={loading}
            onAddToWishlist={handleAddToWishlist}
            onBorrow={handleBorrow}
          />
        ) : (
          <Recomendados
            libros={recomendados}
            onAddToWishlist={handleAddToWishlist}
            onBorrow={handleBorrow}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
