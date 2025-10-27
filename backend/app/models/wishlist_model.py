from fastapi import HTTPException
from app.config.database import get_cursor


def normalize_ol_key(olKey: str) -> str:
    """Normaliza la clave de OpenLibrary eliminando prefijos y barras."""
    if olKey.startswith("/"):
        olKey = olKey[1:]
    if olKey.startswith("works/"):
        olKey = olKey.replace("works/", "")
    return olKey.strip()


async def libro_exists(openlibrary_key: str):
    """Verifica si un libro existe en la tabla `libros`."""
    normalized_key = normalize_ol_key(openlibrary_key)
    async with get_cursor() as (conn, cursor):
        await cursor.execute("SELECT id FROM libros WHERE openlibrary_key = %s", (normalized_key,))
        return await cursor.fetchone()


async def create_libro(openlibrary_key: str, titulo: str, autor_id: int, cover_id: int | None):
    """Inserta un nuevo libro."""
    normalized_key = normalize_ol_key(openlibrary_key)
    async with get_cursor() as (conn, cursor):
        try:
            await cursor.execute("""
                INSERT INTO libros (openlibrary_key, titulo, autor_id, cover_id)
                VALUES (%s, %s, %s, %s)
            """, (normalized_key, titulo, autor_id, cover_id))
            await conn.commit()
            return cursor.lastrowid
        except Exception as e:
            print(f"❌ Error DB al crear libro: {e}")
            await conn.rollback()
            return None


def split_autor_name(autor_completo: str):
    """Divide el nombre completo del autor."""
    partes = autor_completo.split()
    if len(partes) > 1:
        apellido = partes[-1]
        nombre = " ".join(partes[:-1])
        return nombre, apellido
    return autor_completo, ""


async def get_or_create_autor(nombre: str, apellido: str):
    """Obtiene o crea un autor."""
    async with get_cursor() as (conn, cursor):
        try:
            await cursor.execute("SELECT id FROM autores WHERE nombre=%s AND apellido=%s", (nombre, apellido))
            autor = await cursor.fetchone()
            if autor:
                return autor["id"]

            await cursor.execute(
                "INSERT INTO autores (nombre, apellido, nacionalidad) VALUES (%s, %s, %s)",
                (nombre, apellido, "Desconocida"),
            )
            await conn.commit()
            return cursor.lastrowid
        except Exception as e:
            print(f"❌ Error DB al obtener/crear autor: {e}")
            await conn.rollback()
            return None


async def add_to_wishlist(usuario_id: int, libro_id: int):
    """Añade un libro a la lista de deseos del usuario."""
    async with get_cursor() as (conn, cursor):
        try:
            await cursor.execute(
                "SELECT id FROM lista_deseos WHERE usuario_id=%s AND libro_id=%s",
                (usuario_id, libro_id),
            )
            exists = await cursor.fetchone()
            if exists:
                return False

            await cursor.execute(
                "INSERT INTO lista_deseos (usuario_id, libro_id) VALUES (%s, %s)",
                (usuario_id, libro_id),
            )
            await conn.commit()
            return True
        except Exception as e:
            print(f"❌ Error DB al añadir a lista de deseos: {e}")
            await conn.rollback()
            return False


async def get_wishlist(usuario_id: int):
    """Obtiene la lista de deseos del usuario."""
    async with get_cursor() as (conn, cursor):
        await cursor.execute("""
            SELECT l.id, l.titulo, l.cover_id, l.openlibrary_key, a.nombre AS autor
            FROM lista_deseos d
            INNER JOIN libros l ON d.libro_id = l.id
            INNER JOIN autores a ON l.autor_id = a.id
            WHERE d.usuario_id = %s
        """, (usuario_id,))
        return await cursor.fetchall()


async def ensure_book_is_persisted(libro_data: dict) -> int | None:
    """Garantiza que el libro exista en la DB."""
    try:
        nombre, apellido = split_autor_name(libro_data["autor"])
        autor_id = await get_or_create_autor(nombre, apellido)
        if not autor_id:
            return None

        libro_record = await libro_exists(libro_data["openlibrary_key"])
        if libro_record:
            return libro_record["id"]

        return await create_libro(
            libro_data["openlibrary_key"],
            libro_data["titulo"],
            autor_id,
            libro_data.get("cover_id"),
        )
    except Exception as e:
        print(f"❌ Error en persistencia de libro: {e}")
        return None


async def eliminar_de_lista_deseos(usuario_id: int, libro_id: int):
    """Elimina un libro de la lista de deseos del usuario."""
    async with get_cursor() as (conn, cursor):
        await cursor.execute(
            "SELECT * FROM lista_deseos WHERE usuario_id = %s AND libro_id = %s",
            (usuario_id, libro_id)
        )
        existe = await cursor.fetchone()

        if not existe:
            print(f"⚠️ No existe en DB: usuario_id={usuario_id}, libro_id={libro_id}")
            raise HTTPException(status_code=404, detail="Libro no encontrado en la lista de deseos.")

        await cursor.execute(
            "DELETE FROM lista_deseos WHERE usuario_id = %s AND libro_id = %s",
            (usuario_id, libro_id)
        )
        await conn.commit()
        return {"message": "Libro eliminado correctamente"}
