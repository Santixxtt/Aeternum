from fastapi import APIRouter, HTTPException, Depends
from app.utils.security import get_current_user
from app.models import wishlist_model, review_model
from fastapi_cache.decorator import cache
from fastapi_cache import FastAPICache

router = APIRouter(prefix="/reviews", tags=["Reviews"])


# 🟢 Registrar o actualizar calificación
@router.post("/rate")
async def submit_rating(data: dict, current_user: dict = Depends(get_current_user)):
    usuario_id = int(current_user["sub"])
    puntuacion = data.get("puntuacion")

    if puntuacion is None or not (0.0 <= puntuacion <= 5.0):
        raise HTTPException(status_code=400, detail="Puntuación inválida (debe ser entre 0 y 5).")

    libro_id = await wishlist_model.ensure_book_is_persisted(data["libro"])
    if not libro_id:
        raise HTTPException(status_code=500, detail="No se pudo guardar la referencia del libro.")

    success = await review_model.insert_rating(usuario_id, libro_id, puntuacion)
    if not success:
        raise HTTPException(status_code=500, detail="Error al registrar/actualizar la calificación en la base de datos.")

    # Borrado de caché total para forzar la actualización inmediata de promedios/votos
    await FastAPICache.clear()
    return {"message": "Calificación registrada con éxito"}


# 🟢 Obtener promedio y votos de un libro
@router.get("/ratings/{openlibrary_key}")
@cache(expire=30, namespace="reviews_ratings")
async def get_book_ratings(openlibrary_key: str):
    libro_record = await wishlist_model.libro_exists(openlibrary_key)
    if not libro_record:
        return {"promedio": 0.0, "total_votos": 0}

    stats = await review_model.get_average_rating(libro_record["id"])
    return stats


# 🟢 Obtener comentarios de un libro
@router.get("/comments/{openlibrary_key}")
@cache(expire=30, namespace="reviews_comments")
async def get_book_comments(openlibrary_key: str):
    # Se añade la ID del usuario actual al modelo si es necesario para saber qué comentar es suyo.
    # El modelo review_model.get_comments_by_book DEBE incluir el 'usuario_id' del autor del comentario.
    libro_record = await wishlist_model.libro_exists(openlibrary_key)
    if not libro_record:
        return {"comments": []}

    comments = await review_model.get_comments_by_book(libro_record["id"])
    return {"comments": comments}


# 🟢 Insertar comentario nuevo
@router.post("/comment")
async def submit_comment(data: dict, current_user: dict = Depends(get_current_user)):
    usuario_id = int(current_user["sub"])
    texto = data.get("texto", "").strip()

    if not texto:
        raise HTTPException(status_code=400, detail="El texto del comentario no puede estar vacío.")

    libro_id = await wishlist_model.ensure_book_is_persisted(data["libro"])
    if not libro_id:
        raise HTTPException(status_code=500, detail="Error al procesar la referencia del libro para el comentario.")

    success = await review_model.insert_comment(usuario_id, libro_id, texto)
    if not success:
        raise HTTPException(status_code=500, detail="Error al guardar el comentario en la base de datos.")

    # Borrado de caché total para forzar la actualización inmediata de comentarios
    await FastAPICache.clear()
    return {"message": "Comentario agregado con éxito"}


# 🟢 Obtener calificación de un usuario
@router.get("/user-rating/{openlibrary_key}")
async def get_user_rating_route(openlibrary_key: str, current_user: dict = Depends(get_current_user)):
    usuario_id = int(current_user["sub"])
    
    libro_record = await wishlist_model.libro_exists(openlibrary_key)
    if not libro_record:
        return {"user_rating": 0} 

    rating = await review_model.get_user_rating(usuario_id, libro_record["id"])
    return {"user_rating": rating or 0} 


# 🟢 Actualizar comentario
@router.put("/comment/{comment_id}")
async def update_comment_route(comment_id: int, data: dict, current_user: dict = Depends(get_current_user)):
    usuario_id = int(current_user["sub"])
    new_text = data.get("texto", "").strip()

    if not new_text or len(new_text) < 5:
        raise HTTPException(status_code=400, detail="El texto editado no puede estar vacío y debe tener al menos 5 caracteres.")
    
    success = await review_model.update_comment(comment_id, usuario_id, new_text)

    if not success:
        # Se asume que review_model.update_comment devuelve False si no existe o no es el autor
        raise HTTPException(status_code=403, detail="No tienes permiso para editar este comentario o el comentario no existe.")

    # Borrado de caché total para forzar la actualización inmediata de comentarios
    await FastAPICache.clear()
    return {"message": "Comentario actualizado con éxito"}


# 🟢 Eliminar comentario
@router.delete("/comment/{comment_id}")
async def delete_comment_route(comment_id: int, current_user: dict = Depends(get_current_user)):
    usuario_id = int(current_user["sub"])

    success = await review_model.delete_comment(comment_id, usuario_id)

    if not success:
        raise HTTPException(status_code=403, detail="No tienes permiso para eliminar este comentario o el comentario no existe.")

    # Borrado de caché total para forzar la actualización inmediata de comentarios
    await FastAPICache.clear()
    return {"message": "Comentario eliminado con éxito"}