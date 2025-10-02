from fastapi import APIRouter, HTTPException, Request
from app.models.user_model import get_user_by_email, reset_login_attempts, increment_login_attempts
from app.utils.security import verify_password, hash_password, create_access_token
from datetime import datetime, timedelta
from app.schemas.user_schema import UserLogin, UserRegister
from app.models import user_model

router = APIRouter(prefix="/auth", tags=["Auth"])

MAX_ATTEMPTS = 3
LOCK_TIME_MINUTES = 5

@router.post("/login")
def login(user_data: UserLogin):
    user = get_user_by_email(user_data.correo)
    if not user:
        raise HTTPException(status_code=401, detail="El correo no está registrado, revise nuevamente o cree una cuenta.")
    #  Verificar bloqueo
    if user["bloqueado_hasta"] and datetime.now() < user["bloqueado_hasta"]:
        raise HTTPException(status_code=403, detail="Cuenta bloqueada. Intenta más tarde.")
    

    attempts = user.get("intentos_fallidos") if isinstance(user, dict) else user["intentos_fallidos"]
    attempts = int(attempts or 0)

    #  Validar clave
    if not verify_password(user_data.clave, user["clave"]):
        remaining = MAX_ATTEMPTS - (user["intentos_fallidos"] + 1)
        increment_login_attempts(user["id"], MAX_ATTEMPTS, LOCK_TIME_MINUTES)

        if remaining > 0:
            raise HTTPException(status_code=401, detail=f"Clave incorrecta. Intentos restantes: {remaining}")
        else:
            raise HTTPException(status_code=403, detail="Cuenta bloqueada por intentos fallidos.")

    # Login correcto → resetear intentos
    reset_login_attempts(user["id"])

    #  Generar token JWT
    token = create_access_token(
        data={"sub": str(user["id"]), "correo": user["correo"], "rol": user["rol"]}
    )
    safe_user = {
    "id": user["id"],
    "nombre": user["nombre"],
    "apellido": user["apellido"],
    "correo": user["correo"],
    "rol": user["rol"]
    }
    return {
        "access_token": token,
        "token_type": "bearer",
        "rol": user["rol"]
    }



@router.post("/register")
def register_user(user: UserRegister, request: Request):
    # Validación de consentimiento
    if not user.consent:
        raise HTTPException(status_code=400, detail="Debes aceptar la Política de Privacidad.")

    # Verificar email duplicado
    if user_model.email_exists(user.correo):
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")

    # Verificar número de identificación duplicado
    if user_model.id_exists(user.num_identificacion):
        raise HTTPException(status_code=400, detail="El número de identificación ya está registrado.")

    hashed = hash_password(user.clave)

    # Insertar usuario
    user_id = user_model.create_user({
        "nombre": user.nombre,
        "apellido": user.apellido,
        "tipo_identificacion": user.tipo_identificacion,
        "num_identificacion": user.num_identificacion,
        "correo": user.correo,
        "clave": hashed,
        "rol": user.rol
    })

    # Guardar consentimiento
    consent_text = f"Acepto la Política de Privacidad de Aeternum (v1) - {datetime.now().strftime('%Y-%m-%d')}"
    ip = request.client.host
    user_agent = request.headers.get("user-agent", "")[:255]
    user_model.save_consent(user_id, consent_text, ip, user_agent)

    return {"message": "¡Cuenta creada con éxito!", "user_id": user_id}
