import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "../loyout_reusable/footer";
import SearchResults from "./SearchResults";
import RandomBookLoader from "./RandomBookLoader";
import Bottomnav from "../loyout_major/Bottomnav"; // ¡Asegúrate de que la ruta sea correcta!
import "../../assets/css/dashboard_user.css";

// Acepta la prop isMobile
export default function DashboardUser({ isMobile }) {
  const [usuario, setUsuario] = useState(null);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirigir si no hay token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // Cargar datos del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://127.0.0.1:8000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar usuario");
        return res.json();
      })
      .then((data) => setUsuario(data))
      .catch((err) => console.error("Error al cargar datos del usuario:", err));
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

  // Lógica COMPLETA para agregar a lista de deseos (corregido)
  const handleAddToWishlist = useCallback(async (book) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para agregar libros a tu lista de deseos.");
      return;
    }

    const body = {
      titulo: book.title,
      autor: book.author_name?.[0] || "Desconocido",
      cover_id: book.cover_i || null,
      openlibrary_key: book.key,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(
          `❌ ${err.detail || "Error al agregar libro a la lista de deseos."}`
        );
        return;
      }

      const data = await res.json();
      console.log("✅ Libro agregado:", data);
      alert("✅ Libro agregado a tu lista de deseos.");
    } catch (error) {
      console.error("Error al agregar a la lista de deseos:", error);
      alert(
        "No se pudo agregar el libro a la lista de deseos. Intenta más tarde."
      );
    }
  }, []);

  // Función para pedir prestado
  const handleBorrow = useCallback((book) => {
    console.log("Pedir prestado:", book);
    // TODO: Implementar lógica de préstamo
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-user">
      {/* RENDERIZADO CONDICIONAL DE NAVEGACIÓN */}
      {isMobile ? (
        <Bottomnav isDashboard={true} onLogout={handleLogout} />
      ) : (
        <Header
          onSearch={(q) => {
            setQuery(q);
            searchBooks(q);
          }}
          onLogout={handleLogout}
        />
      )}

      <main>
        {usuario && query.length === 0 && (
          <section className="dashboard-user dashboard-hero">
            <h1>
              Bienvenid@ {usuario.nombre} {usuario.apellido}
            </h1>
            <p>
              !Que bueno tenerte aqui¡ ¿Estas listo para leer? Pues bueno es
              hora de explorar nuevos libros y dejarte llevar por historias
              fascinantes.No es solo leer, es vivir mil vidas desde la comodidad
              de tus propios pensamientos. ¡Empieza ahora tu viaje hacia lo
              extraordinario!
            </p>
            <a href="/loyout_user/lista_deseos" className="cta-button" data-aos="zoom-in">
              Mira tu Lista de Deseos
            </a>
          </section>
        )}

        <hr />

        {query.length >= 3 ? (
          <SearchResults
            libros={resultados}
            loading={loading}
            onAddToWishlist={handleAddToWishlist}
            onBorrow={handleBorrow}
          />
        ) : (
          <RandomBookLoader
            onAddToWishlist={handleAddToWishlist}
            onBorrow={handleBorrow}
          />
        )}
      </main>
      <hr />

      {/* Opcionalmente, ocultar el Footer en móvil si se usa BottomNav */}
      {!isMobile && <Footer />}
    </div>
  );
}
