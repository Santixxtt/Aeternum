from fastapi import APIRouter, Depends, HTTPException
from app.models.user_model import get_user_by_id
from app.utils.security import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
async def get_current_user_data(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    user = await get_user_by_id(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    return {
        "id": user["id"],
        "nombre": user["nombre"],
        "apellido": user["apellido"],
        "correo": user["correo"],
        "rol": user["rol"],
    }
