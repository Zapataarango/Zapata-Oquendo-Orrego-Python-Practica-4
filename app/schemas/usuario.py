from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr
    rol: str
    activo: bool = True

class UsuarioCreate(UsuarioBase):
    password: str
    
class UsuarioOut(UsuarioBase):
    id_usuario: int
    
    class Config:
        orm_mode = True
