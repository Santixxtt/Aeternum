import React, { useState, useEffect, useCallback, useRef } from "react";
import CommentsEdit from "./CommentEdit" 
import defaultImage from "../../assets/img/book-placeholder.png";
import { jwtDecode } from 'jwt-decode';

export default function BookModal({ book, onClose, onAddToWishlist }) {
    const [description, setDescription] = useState("Cargando resumen...");
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0); 
    const [averageRating, setAverageRating] = useState(0.0);
    const [totalVotes, setTotalVotes] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const textareaRef = useRef(null);
    const [loadingReviews, setLoadingReviews] = useState(true); 
    const [reviewsRefreshKey, setReviewsRefreshKey] = useState(0);
    const token = localStorage.getItem("token");

    const [currentUserId, setCurrentUserId] = useState(null);
    const [activeCommentMenu, setActiveCommentMenu] = useState(null); 
    const [isEditing, setIsEditing] = useState(null); 
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); 

    const bookData = React.useMemo(() => ({
        titulo: book.title,
        autor: book.author_name?.[0] || "Desconocido",
        cover_id: book.cover_i || null,
        openlibrary_key: book.key,
    }), [book.title, book.author_name, book.cover_i, book.key]);

    const cleanOlKey = (olKey) => {
        let cleanedKey = olKey.startsWith('/') ? olKey.substring(1) : olKey;
        const parts = cleanedKey.split('/');
        return parts[parts.length - 1]; 
    };

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUserId(parseInt(decoded.sub));
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                setCurrentUserId(null);
            }
        } else {
            setCurrentUserId(null);
        }
    }, [token]);
    
    const fetchUserRating = useCallback(async (olKey) => {
        if (!token) {
            setRating(0);
            return;
        }
        
        const key = cleanOlKey(olKey);
        
        try {
            const userRatingRes = await fetch(`http://127.0.0.1:8000/reviews/user-rating/${key}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userRatingData = await userRatingRes.json();
            setRating(userRatingData.user_rating || 0); 
        } catch (error) {
            console.error("Error al cargar calificación del usuario:", error);
            setRating(0);
        }
    }, [token]);

    const fetchReviewsAndComments = useCallback(async (olKey) => {
        setLoadingReviews(true);
        const key = cleanOlKey(olKey);

        try {
            await fetchUserRating(olKey);

            const ratingsRes = await fetch(`http://127.0.0.1:8000/reviews/ratings/${key}`);
            const ratingsData = await ratingsRes.json();
            setAverageRating(ratingsData.promedio || 0.0);
            setTotalVotes(ratingsData.total_votos || 0);

            const commentsRes = await fetch(`http://127.0.0.1:8000/reviews/comments/${key}`);
            const commentsData = await commentsRes.json();
            setComments(commentsData.comments || []);
            
        } catch (error) {
            console.error("Error al cargar reviews/comentarios:", error);
        } finally {
            setLoadingReviews(false); 
        }
    }, [fetchUserRating]);
    
    useEffect(() => {
        const fetchDescription = async () => {
            setLoading(true);
            try {
                const url = `https://openlibrary.org${book.key}.json`;
                const res = await fetch(url);
                const data = await res.json();
                let newDescription = "No hay resumen disponible.";

                if (data.description) {
                    newDescription = typeof data.description === "string"
                        ? data.description
                        : data.description.value || newDescription;
                } else if (data.excerpt?.value) {
                    newDescription = data.excerpt.value;
                }

                setDescription(newDescription);
            } catch (err) {
                console.error("Error al cargar detalles del libro:", err);
                setDescription("Error al cargar resumen. Intenta de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        if (book?.key) {
            fetchDescription();
        }
    }, [book]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [commentText]);

    useEffect(() => {
        if (bookData.openlibrary_key) {
            fetchUserRating(bookData.openlibrary_key);
            fetchReviewsAndComments(bookData.openlibrary_key);
        }
    }, [bookData.openlibrary_key, token, reviewsRefreshKey, fetchUserRating, fetchReviewsAndComments, isEditing, currentUserId]);


    const handleSubmitRating = async (newRating) => {
        if (!token) {
            alert("Debes iniciar sesión para calificar.");
            return;
        }
        if (newRating < 1 || newRating > 5) return;
        
        setRating(newRating);

        try {
            const res = await fetch("http://127.0.0.1:8000/reviews/rate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    puntuacion: newRating,
                    libro: bookData,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                fetchUserRating(bookData.openlibrary_key); 
                alert(`Error: ${err.detail || "Error al enviar la calificación."}`);
            } else {
                fetchReviewsAndComments(bookData.openlibrary_key);
                setReviewsRefreshKey(prev => prev + 1); 
            }
        } catch (error) {
            console.error("Error en la solicitud de calificación:", error);
            alert("No se pudo conectar al servidor para calificar.");
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!token) {
            alert("Debes iniciar sesión para comentar.");
            return;
        }
        if (commentText.trim().length < 5) {
            alert("El comentario debe tener al menos 5 caracteres.");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/reviews/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    texto: commentText.trim(),
                    libro: bookData,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                alert(`Error: ${err.detail || "Error al enviar el comentario."}`);
            } else {
                alert("Comentario enviado con éxito.");
                setCommentText("");
                fetchReviewsAndComments(bookData.openlibrary_key);
            }
        } catch (error) {
            console.error("Error en la solicitud de comentario:", error);
            alert("No se pudo conectar al servidor para comentar.");
        }
    };

    // 🆕 Funciones para manejar el estado de edición
    const startEditComment = (comment) => {
        setActiveCommentMenu(null);
        setIsEditing(comment.id);
    };

    const cancelEditComment = () => {
        setIsEditing(null);
    };

    // ❗ REVISADO: Lógica de edición
    const handleEditComment = async (newText) => {
        const commentId = isEditing;

        if (!token) {
            alert("Debes iniciar sesión para editar.");
            return;
        }

        const trimmedText = newText.trim();
        if (trimmedText.length < 5) {
            alert("El comentario debe tener al menos 5 caracteres.");
            return;
        }

        try {
            setLoadingReviews(true); 
            
            const res = await fetch(`http://127.0.0.1:8000/reviews/comment/${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ texto: trimmedText }), 
            });

            if (!res.ok) {
                const err = await res.json();
                alert(`Error al editar: ${err.detail || "Error al actualizar el comentario."}`);
            } else {
                alert("Comentario actualizado con éxito.");
            }
        } catch (error) {
            console.error("Error en la solicitud de edición:", error);
            alert("No se pudo conectar al servidor para editar el comentario.");
        } finally {
            cancelEditComment(); 
            fetchReviewsAndComments(bookData.openlibrary_key); 
        }
    };

    // ❗ REVISADO: Lógica de eliminación
    const handleDeleteComment = async (commentId) => {
        if (!token) {
            alert("Debes iniciar sesión para eliminar.");
            return;
        }

        if (!window.confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
            return;
        }

        try {
            setLoadingReviews(true); // 🟢 Muestra el mensaje "Cargando comentarios..."
            setActiveCommentMenu(null); 

            const res = await fetch(`http://127.0.0.1:8000/reviews/comment/${commentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const err = await res.json();
                alert(`Error al eliminar: ${err.detail || "Error al eliminar el comentario."}`);
            } else {
                alert("Comentario eliminado con éxito.");
            }
        } catch (error) {
            console.error("Error en la solicitud de eliminación:", error);
            alert("No se pudo conectar al servidor para eliminar el comentario.");
        } finally {
            // Refresca la lista y oculta el loader
            fetchReviewsAndComments(bookData.openlibrary_key);
        }
    };


    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };

    const imageUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : defaultImage;
    
    const renderDescription = () => {
        if (loading) return <p>Cargando el resumen...</p>;
        if (!description || description === "No hay resumen disponible.") return <p>No hay resumen disponible.</p>;

        const MAX_CHARS = 260;
        const needsTruncation = description.length > MAX_CHARS; 

        if (isDescriptionExpanded || !needsTruncation) {
            return (
                <p>
                    {description}
                    {needsTruncation && (
                        <button 
                            onClick={() => setIsDescriptionExpanded(false)}
                            className="btn-link more-less"
                            >
                            menos
                        </button>
                    )}
                </p>
            );
        } else {
            const truncatedDescription = description.substring(0, MAX_CHARS) + '...';
            return (
              <p>
                {truncatedDescription}
                <button
                  onClick={() => setIsDescriptionExpanded(true)}
                  className="btn-link more-less"
                >
                  más
                </button>
              </p>
            );
        }
    };

    const CommentItem = ({ comment }) => {
        const isAuthor = currentUserId === comment.usuario_id;
        const isMenuOpen = activeCommentMenu === comment.id;

        if (isEditing === comment.id) {
            return null; 
        }

        return (
            <div key={comment.id} className="comment-item"> 
            <p>
                <strong>{comment.nombre_usuario ?? comment.nombre ?? 'Usuario Desconocido'}</strong>
            </p>
            <p>{comment.texto}</p>
            <small>{new Date(comment.fecha_comentario).toLocaleDateString()}</small>

            {/* Icono de Opciones */}
            {isAuthor && (
                // 2. Modificación en el icono de opciones
                <div 
                    className="comment-options" 
                    onClick={() => setActiveCommentMenu(isMenuOpen ? null : comment.id)}
                >
                    <i className='bx bx-dots-vertical-rounded'></i>
                </div>
            )}

            {/* Menú Desplegable */}
            {isAuthor && isMenuOpen && (
                // 3. Modificación en el menú desplegable
                <div 
                    className="comment-menu"
                >
                    <button 
                        onClick={() => startEditComment(comment)}
                        // ❌ Eliminamos el style
                    >
                        <i className='bx bx-edit-alt'></i> Editar
                    </button>
                    <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="btn-delete" // 4. Clase para el botón de eliminar
                        // ❌ Eliminamos el style
                    >
                        <i className='bx bx-trash'></i> Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    <i className="bx bx-x"></i>
                </button>

                <div className="modal-body">
                    <div className="modal-image">
                        <img
                            src={imageUrl}
                            alt={book.title}
                            onError={(e) => {
                                if (e.target.src !== defaultImage) {
                                    e.target.src = defaultImage;
                                }
                            }}
                        />
                    </div>

                    <div className="modal-info">
                        <h2>{book.title}</h2>
                        <p><strong>Autor:</strong> {book.author_name?.[0] || "Desconocido"}</p>

                        <section className="rating-section">
                            <h3>Calificación del Libro</h3>
                            {loadingReviews ? (
                                <p>Cargando estadísticas...</p>
                            ) : (
                                <>
                                    <p>
                                        Promedio: <strong>{averageRating.toFixed(1)} / 5</strong> ({totalVotes} votos)
                                    </p>
                                    <div className="star-rating">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={star <= rating ? "star-active" : "star-inactive"}
                                                onClick={() => handleSubmitRating(star)}
                                            >
                                                &#9733;
                                            </span>
                                        ))}
                                        <p>Mi calificación: {rating > 0 ? `${rating} estrellas` : "Sin calificar"}</p>
                                    </div>
                                </>
                            )}
                        </section>

                        <div className="modal-description">
                            <h3>Resumen</h3>
                            {renderDescription()}
                        </div>
                        
                        <div className="modal-comments">
                            <h3>Comentarios</h3>

                            <div className="comments-feed-box">
                                {loadingReviews ? (
                                    <p>Cargando comentarios...</p>
                                ) : comments.length === 0 ? (
                                    <p>Aún no hay comentarios para este libro.</p>
                                ) : (
                                    <div className="comments-list">
                                        {comments.map((comment) => (
                                            <CommentItem key={comment.id} comment={comment} />
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* ❗ CORREGIDO: Usando el componente CommentsEdit importado */}
                            {token && isEditing !== null ? (
                                <CommentsEdit 
                                    initialText={comments.find(c => c.id === isEditing)?.texto || ''}
                                    onSave={handleEditComment}
                                    onCancel={cancelEditComment}
                                    placeholder={`Editando comentario...`}
                                    nombreUsuario={comments.find(c => c.id === isEditing)?.nombre_usuario}
                                />
                            ) : token ? (
                                <form onSubmit={handleSubmitComment} className="comment-form">
                                    <textarea
                                        ref={textareaRef} 
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Escribe tu comentario..."
                                        required
                                    />
                                    <button type="submit" className="submit-button">
                                        <i className='bx bx-paper-plane'></i> Enviar
                                    </button>
                                </form>
                            ) : (
                                <p>Inicia sesión para dejar un comentario.</p>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button onClick={() => console.log("Préstamo físico")}>
                                <i className="bxs-book"></i> Préstamo Físico
                            </button>
                            <button onClick={() => window.open(`https://openlibrary.org${book.key}`, "_blank")}>
                                <i className="bxs-laptop"></i> Préstamo Digital
                            </button>
                            <button onClick={() => window.open(`https://openlibrary.org${book.key}/borrow`, "_blank")}>
                                <i className="bxs-download"></i> Descargar
                            </button>
                            <button onClick={() => onAddToWishlist(book)}>
                                <i className="bxs-star"></i> Lista de Deseos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}