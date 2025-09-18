from pydantic import BaseModel, EmailStr
from typing import Optional, Literal

class UserRegister(BaseModel):
    id: Optional[int] = None
    nombre: str
    apellido: str
    tipo_identificacion: str
    num_identificacion: str
    correo: EmailStr
    clave: str
    consent: bool
    rol: Literal["usuario", "bibliotecario"] = "usuario" #Por defecto usuario

class UserLogin(BaseModel):
    correo: EmailStr
    clave: str