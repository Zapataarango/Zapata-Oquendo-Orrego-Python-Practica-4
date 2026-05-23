from pydantic import BaseModel
from datetime import date
from typing import Optional
from enum import Enum

class EstadoReserva(str, Enum):
    """Estados válidos para una reserva."""
    ESPERANDO = "esperando"
    APROBADA = "aprobada"
    RECHAZADA = "rechazada"

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

