from pydantic import BaseModel
from typing import Optional

class EspacioBase(BaseModel):
    nombre: str
    ubicacion: str
    capacidad: int
    estado: str

class EspacioCreate(EspacioBase):
    pass

class EspacioOut(EspacioBase):
    id_espacio: int
    class Config:
        orm_mode = True
