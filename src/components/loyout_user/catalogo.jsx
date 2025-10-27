import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "../loyout_reusable/footer";
import SearchResults from "./SearchResults";
import "../../assets/css/catalogo.css";

export default function Catalogo() {
  const navigate = useNavigate();
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos");

  // Redirigir si no hay token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // Función para cargar catálogo memoizada
  const cargarCatalogo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=subject:fiction&limit=48`
      );
      const data = await res.json();
      setResultados(data.docs || []);
    } catch (error) {
      console.error("Error al cargar el catálogo:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar libros del catálogo al iniciar
  useEffect(() => {
    cargarCatalogo();
  }, [cargarCatalogo]);

  // Función de búsqueda memoizada
  const searchBooks = useCallback(
    async (q) => {
      if (!q || q.length < 3) {
        cargarCatalogo();
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=50`
        );
        const data = await res.json();
        setResultados(data.docs || []);
      } catch (error) {
        console.error("Error al buscar libros:", error);
      } finally {
        setLoading(false);
      }
    },
    [cargarCatalogo]
  );

  // Función para filtrar por categoría
  const filtrarPorCategoria = useCallback(async (categoria) => {
    setCategoriaSeleccionada(categoria);
    setLoading(true);
    try {
      let url = "";
      if (categoria === "todos") {
        url = `https://openlibrary.org/search.json?q=subject:fiction&limit=50`;
      } else {
        url = `https://openlibrary.org/search.json?q=subject:${categoria}&limit=50`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setResultados(data.docs || []);
    } catch (error) {
      console.error("Error al filtrar libros:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para agregar a wishlist
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

  // Función para cerrar sesión
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  // Manejador de búsqueda para el Header
  const handleSearch = useCallback(
    (q) => {
      searchBooks(q);
    },
    [searchBooks]
  );

return (
  <div className="dashboard-user">
   <Header onSearch={handleSearch} onLogout={handleLogout} />

   <main>
    <section className="text-center">
     <h1>Catálogo de Libros</h1>
     <p>Explora nuestra colección completa de libros</p>
    </section>
    
    <div className="catalogo-container"> 

     <section className="filtros">
      <h2>Filtrar por categoría</h2>
      <div className="categoria-buttons">
       {/* Mantenemos el código de los botones tal cual */}
       <button
        className={categoriaSeleccionada === "todos" ? "active" : ""}
        onClick={() => filtrarPorCategoria("todos")}
       >
        Todos
       </button>
            <button
              className={categoriaSeleccionada === "fiction" ? "active" : ""}
              onClick={() => filtrarPorCategoria("fiction")}
            >
              Ficción
            </button>
            <button
              className={categoriaSeleccionada === "science" ? "active" : ""}
              onClick={() => filtrarPorCategoria("science")}
            >
              Ciencia
            </button>
            <button
              className={categoriaSeleccionada === "history" ? "active" : ""}
              onClick={() => filtrarPorCategoria("history")}
            >
              Historia
            </button>
            <button
              className={categoriaSeleccionada === "fantasy" ? "active" : ""}
              onClick={() => filtrarPorCategoria("fantasy")}
            >
              Fantasía
            </button>
            <button
              className={categoriaSeleccionada === "mystery" ? "active" : ""}
              onClick={() => filtrarPorCategoria("mystery")}
            >
              Misterio
            </button>
          </div>
        </section>

        <hr />

        <div className="catalogo-book-grid">
          <SearchResults
          libros={resultados}
          loading={loading}
          onAddToWishlist={handleAddToWishlist}
          onBorrow={handleBorrow}
        />
        </div>
        </div>
      </main>
      <hr />
      <Footer />
    </div>
  );
}
