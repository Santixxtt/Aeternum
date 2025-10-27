from fastapi import APIRouter, HTTPException, Request
from app.models import user_model
from app.utils.security import verify_password, hash_password, create_access_token
from datetime import datetime
from app.schemas.user_schema import UserLogin, UserRegister

router = APIRouter(prefix="/auth", tags=["Auth"])

MAX_ATTEMPTS = 3
LOCK_TIME_MINUTES = 15

# 🔹 LOGIN
@router.post("/login")
async def login(user_data: UserLogin):
    user = await user_model.get_user_by_email(user_data.correo)
    if not user:
        raise HTTPException(status_code=401, detail="El correo no está registrado.")

    # Verificar bloqueo
    if user["bloqueado_hasta"] and datetime.now() < user["bloqueado_hasta"]:
        raise HTTPException(status_code=403, detail="Cuenta bloqueada temporalmente.")

    attempts = int(user.get("intentos_fallidos", 0))

    # Validar contraseña
    if not verify_password(user_data.clave, user["clave"]):
        remaining = MAX_ATTEMPTS - (attempts + 1)
        await user_model.increment_login_attempts(user["id"], MAX_ATTEMPTS, LOCK_TIME_MINUTES)

        if remaining > 0:
            raise HTTPException(status_code=401, detail=f"Clave incorrecta. Intentos restantes: {remaining}")
        else:
            raise HTTPException(status_code=403, detail="Cuenta bloqueada por intentos fallidos.")

    # Login correcto → resetear intentos
    await user_model.reset_login_attempts(user["id"])

    # Generar token JWT
    token = create_access_token(
        data={"sub": str(user["id"]), "correo": user["correo"], "rol": user["rol"]}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "rol": user["rol"]
    }


# 🔹 REGISTER
@router.post("/register")
async def register_user(user: UserRegister, request: Request):
    if not user.consent:
        raise HTTPException(status_code=400, detail="Debes aceptar la Política de Privacidad.")

    # Verificar duplicados
    if await user_model.email_exists(user.correo):
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")
    if await user_model.id_exists(user.num_identificacion):
        raise HTTPException(status_code=400, detail="El número de identificación ya está registrado.")

    hashed = hash_password(user.clave)

    user_id = await user_model.create_user({
        "nombre": user.nombre,
        "apellido": user.apellido,
        "tipo_identificacion": user.tipo_identificacion,
        "num_identificacion": user.num_identificacion,
        "correo": user.correo,
        "clave": hashed,
        "rol": user.rol
    })

    # Guardar consentimiento
    consent_text = f"Acepto la Política de Privacidad de Aeternum (v1) - {datetime.now():%Y-%m-%d}"
    ip = request.client.host
    user_agent = request.headers.get("user-agent", "")[:255]
    await user_model.save_consent(user_id, consent_text, ip, user_agent)

    return {"message": "¡Cuenta creada con éxito!", "user_id": user_id}
