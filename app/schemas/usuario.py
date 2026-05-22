from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioBase(BaseModel):
	nombre: str
	correo: EmailStr
	rol: str

class UsuarioCreate(UsuarioBase):
	pass

class UsuarioOut(UsuarioBase):
	id_usuario: int
	class Config:
		orm_mode = True
