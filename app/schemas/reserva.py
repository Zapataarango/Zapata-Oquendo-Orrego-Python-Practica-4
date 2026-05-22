from pydantic import BaseModel
from datetime import date
from typing import Optional

class ReservaBase(BaseModel):
    id_usuario: int
    id_espacio: int
    fecha: date
    hora_inicio: str
    hora_fin: str
    cantidad_asistentes: int
    estado: str

class ReservaCreate(ReservaBase):
    pass

class ReservaOut(ReservaBase):
    id_reserva: int
    class Config:
        orm_mode = True
