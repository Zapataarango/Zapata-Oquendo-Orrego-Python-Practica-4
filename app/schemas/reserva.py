from pydantic import BaseModel, Field
from datetime import date, time
from typing import Optional
from enum import Enum

class EstadoReserva(str, Enum):
    """Estados válidos para una reserva."""
    ESPERANDO = "esperando"
    APROBADA = "aprobada"
    RECHAZADA = "rechazada"
    CANCELADA = "cancelada"
    INACTIVO = "inactivo"
    MANTENIMIENTO = "mantenimiento"
    NO_DISPONIBLE = "no disponible"

class ReservaBase(BaseModel):
    id_usuario: int
    id_espacio: int
    fecha: date
    hora_inicio: time
    hora_fin: time
    cantidad_asistentes: int
    estado: str

class ReservaCreate(BaseModel):
    id_espacio: int

    fecha: date = Field(
        ...,
        description="Formato YYYY-MM-DD",
        json_schema_extra={"example": "2026-05-23"}
    )

    hora_inicio: time = Field(
        ...,
        description="Formato 24 horas HH:MM",
        json_schema_extra={"example": "14:00"}
    )

    hora_fin: time = Field(
        ...,
        description="Formato 24 horas HH:MM",
        json_schema_extra={"example": "16:00"}
    )

    cantidad_asistentes: int = Field(
        ...,
        gt=0,
        json_schema_extra={"example": 5}
    )

class ReservaOut(ReservaBase):
    id_reserva: int
    class Config:
        orm_mode = True

