from fastapi import APIRouter, HTTPException, Depends
from app.models import wishlist_model
from app.utils.security import get_current_user
from app.config.database import get_cursor

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


# 🔹 Agregar libro a la lista de deseos
@router.post("/add")
async def add_to_wishlist_route(libro: dict, current_user: dict = Depends(get_current_user)):
    usuario_id = int(current_user["sub"])
    libro_id = await wishlist_model.ensure_book_is_persisted(libro)

    if not libro_id:
        raise HTTPException(status_code=500, detail="Error al procesar el libro en el sistema.")

    added = await wishlist_model.add_to_wishlist(usuario_id, libro_id)
    if not added:
        raise HTTPException(status_code=400, detail="Este libro ya está en tu lista de deseos.")

    return {"message": "Libro agregado a la lista de deseos.", "libro_id": libro_id}


# 🔹 Obtener lista de deseos del usuario autenticado
@router.get("/list")
async def get_wishlist_route(current_user: dict = Depends(get_current_user)):
    usuario_id = int(current_user["sub"])
    deseos = await wishlist_model.get_wishlist(usuario_id)
    return {"wishlist": deseos}

@router.delete("/delete/{book_id}")
async def delete_from_wishlist(book_id: int, current_user: dict = Depends(get_current_user)):
    usuario_id = int(current_user["sub"])

    async with get_cursor() as (conn, cursor):
        print(f"Intentando eliminar: book_id={book_id}, usuario_id={usuario_id}")
        await cursor.execute(
            "DELETE FROM lista_deseos WHERE libro_id = %s AND usuario_id = %s",
            (book_id, usuario_id)
        )
        await conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Libro no encontrado en la lista de deseos")

        return {"message": "Libro eliminado correctamente"}
