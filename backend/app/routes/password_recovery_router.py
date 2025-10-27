# app/routes/password_recovery_router.py
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from app.models import user_model, password_recovery_model
from app.utils.email_sender import send_password_recovery_email
import secrets
from typing import Annotated
from app.utils.security import hash_password

router = APIRouter(prefix="/password", tags=["PasswordRecovery"])

FRONTEND_BASE_URL = "http://localhost:5173"
RESET_PATH = "/restablecer-contrasena"


@router.post("/recuperar_contrasena")
async def solicitar_recuperacion(correo: Annotated[str, Query()], background_tasks: BackgroundTasks):
    # Buscamos usuario (async)
    user = await user_model.get_user_by_email(correo)

    # Respondemos igual si no existe (por seguridad)
    if not user:
        return {"message": "Si este correo está registrado, recibirás un enlace para restablecer tu contraseña."}

    # Generar token y guardar solicitud en DB (async)
    token = secrets.token_hex(32)
    await password_recovery_model.create_recovery_request(user["id"], token)

    # Construir URL y enviar email en background (no bloquea)
    recovery_url = f"{FRONTEND_BASE_URL}{RESET_PATH}?token={token}"
    background_tasks.add_task(send_password_recovery_email, correo, recovery_url)

    return {"message": "Si este correo está registrado, recibirás un enlace para restablecer tu contraseña."}


@router.post("/restablecer_contrasena")
async def restablecer_contrasena(
    token: Annotated[str, Query()],
    nueva_contrasena: Annotated[str, Query()]
):
    # 1) Verificamos token válido (async)
    recovery = await password_recovery_model.get_recovery_request_by_token(token)
    if not recovery:
        raise HTTPException(status_code=400, detail="El enlace ha expirado o no es válido.")

    user_id = recovery["usuario_id"]

    # 2) Hashear nueva contraseña y actualizar (async)
    hashed_password = hash_password(nueva_contrasena)

    # Usamos user_model para actualización (añadiremos función update_password)
    # Si aún no existe, lo implemento abajo. Aquí la llamada:
    updated = await user_model.update_password(user_id, hashed_password)
    if not updated:
        raise HTTPException(status_code=500, detail="Error al actualizar la contraseña.")

    # 3) Marcar token como usado (async)
    await password_recovery_model.mark_token_as_used(token)

    # 4) Responder
    return {"message": "Contraseña restablecida exitosamente"}
