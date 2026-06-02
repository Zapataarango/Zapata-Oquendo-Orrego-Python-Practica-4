from enum import Enum

from pydantic import BaseModel

class EstadoEspacio(str, Enum):
    """Estados válidos para un espacio."""
    DISPONIBLE = "disponible"
    RESERVADO = "reservado"
    INACTIVO = "inactivo"
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
