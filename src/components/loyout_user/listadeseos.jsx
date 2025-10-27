import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "../loyout_reusable/footer";
import BookCard from "./BookCard"; 
import BookModal from "./BookModal"; 
import "../../assets/css/dashboard_user.css";
import "../../assets/css/lista_deseos.css"; 

export default function ListaDeseos() {
    const navigate = useNavigate();
    const [listaDeseos, setListaDeseos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null); 
    const [mensaje, setMensaje] = useState(""); // 👈 Nuevo estado para mensaje

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/");
    }, [navigate]);

    const cargarListaDeseos = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch("http://127.0.0.1:8000/wishlist/list", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Error al obtener lista de deseos");
            const data = await res.json();
            const librosOrdenados = (data.wishlist || []).reverse(); 
            setListaDeseos(librosOrdenados);
        } catch (error) {
            console.error("Error al cargar lista de deseos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarListaDeseos();
    }, []);

    const handleRemoveFromWishlist = async (bookToRemove) => {
        console.log("ListaDeseos.handleRemoveFromWishlist recibido:", bookToRemove);
        const bookId = bookToRemove?.id ?? bookToRemove?.lista_deseos_id ?? null;
        const token = localStorage.getItem("token");

        if (!bookId) {
            console.error("❌ No se encontró ID para eliminar:", bookToRemove);
            alert("Error: ID de libro no encontrado.");
            return;
        }

        if (!token) {
            console.error("❌ No hay token en localStorage.");
            alert("Debes iniciar sesión para eliminar de la lista de deseos.");
            return;
        }

        try {
            const res = await fetch(`http://127.0.0.1:8000/wishlist/delete/${bookId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                let errDetail = null;
                try {
                    const err = await res.json();
                    errDetail = err.detail || JSON.stringify(err);
                } catch {
                    errDetail = `HTTP ${res.status}`;
                }
                throw new Error(errDetail || "Error al eliminar libro");
            }

            // ✅ Eliminar del estado local
            setListaDeseos(prev => prev.filter(book => book.lista_deseos_id !== bookId && book.id !== bookId));
            setSelectedBook(null);

            // ✅ Mostrar mensaje de éxito
            setMensaje("✅ Libro eliminado de la lista de deseos");
            setTimeout(() => setMensaje(""), 2500); // Se borra automáticamente

            console.log(`✅ Libro eliminado de lista: ${bookId}`);
        } catch (error) {
            console.error("❌ Error al eliminar de lista:", error);
            alert("Error al eliminar libro. Intenta de nuevo.");
        }
    };

    const handleBorrow = (book) => console.log("Pedir prestado:", book);
    const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };
    const openBookModal = (book) => setSelectedBook(book);
    const closeBookModal = () => setSelectedBook(null);

    return (
        <div className="dashboard-user">
            <Header onSearch={(q) => console.log("Buscar:", q)} onLogout={handleLogout} />

            {/* ✅ Mensaje animado */}
            {mensaje && (
                <div className="mensaje-exito">
                    {mensaje}
                </div>
            )}

            <main>
                <section className="lista-deseos-hero">
                    <div className="text-center">
                        <span className="dashboard-user mi-span">*</span>
                        <h1>Mi Lista de Deseos</h1>
                        <p>Los libros que has guardado para leer más tarde</p>
                    </div>
                </section>

                <hr className="wishlist-separator" />

                <section className="lista-deseos-content wishlist-container">
                    {loading ? (
                        <div className="loading text-center">
                            <i className="bx bx-loader-alt bx-spin"></i>
                            <p>Cargando tu lista de deseos...</p>
                        </div>
                    ) : listaDeseos.length === 0 ? (
                        <div className="empty-state text-center">
                            <h2>Tu lista de deseos está vacía 😟</h2>
                            <p>Explora nuestro catálogo y añade libros que te interesen.</p>
                            <button
                                className="cta-button"
                                onClick={() => navigate("/loyout_user/catalogo")}
                            >
                                <i className="bx bx-search"></i> Explorar Catálogo
                            </button>
                        </div>
                    ) : (
                        <div className="wishlist-grid">
                            {listaDeseos.map((book) => (
                                <BookCard
                                    key={book.lista_deseos_id ?? book.libro_id ?? book.id}
                                    book={{ 
                                        ...book,
                                        title: book.titulo,
                                        author_name: [book.autor], 
                                        cover_i: book.cover_id,
                                        key: book.openlibrary_key,
                                    }}
                                    onClick={() => openBookModal(book)} 
                                    onBorrow={handleBorrow}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <hr className="wishlist-separator" />
            <Footer />

            {selectedBook && (
                <BookModal
                    book={{ 
                        ...selectedBook, 
                        title: selectedBook.titulo,
                        author_name: [selectedBook.autor], 
                        cover_i: selectedBook.cover_id,
                        key: selectedBook.openlibrary_key,
                        lista_deseos_id: selectedBook.lista_deseos_id 
                    }}
                    onClose={closeBookModal}
                    isBookSaved={true} 
                    isWishlistPage={true}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                    onAddToWishlist={() => {}} 
                />
            )}
        </div>
    );
}
