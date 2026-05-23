from enum import Enum

from pydantic import BaseModel
from typing import Optional

class EstadoEspacio(str, Enum):
    """Estados válidos para un espacio."""
    DISPONIBLE = "disponible"
    OCUPADO = "ocupado"
    MANTENIMIENTO = "mantenimiento"

class EspacioBase(BaseModel):
    nombre: str
    ubicacion: str
    capacidad: int
    estado: EstadoEspacio

class EspacioCreate(EspacioBase):
    pass

class EspacioOut(EspacioBase):
    id_espacio: int
    class Config:
        orm_mode = True
