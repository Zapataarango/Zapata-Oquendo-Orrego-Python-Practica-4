from datetime import datetime, timedelta

from fastapi import HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.models.espacio import Espacio
from app.models.reserva import Reserva
from app.schemas.reserva import EstadoReserva, ReservaCreate



# Crear reserva
def create_reserva(
    db: Session,
    reserva: ReservaCreate,
    id_usuario: int
):
    # Validar espacio existente
    espacio = db.query(Espacio).filter(
        Espacio.id_espacio == reserva.id_espacio
    ).first()

    if not espacio:
        raise HTTPException(
            status_code=404,
            detail="El espacio no existe"
        )

    # Validar estado espacio
    if espacio.estado != "disponible": # type: ignore
        raise HTTPException(
            status_code=400,
            detail="El espacio no está disponible"
        )

    # Construir datetime usando tipos date y time
    fecha_inicio = datetime.combine(
        reserva.fecha,
        reserva.hora_inicio
    )

    fecha_fin = datetime.combine(
        reserva.fecha,
        reserva.hora_fin
    )

    ahora = datetime.now()

    # Validar anticipación mínima
    if fecha_inicio < ahora + timedelta(hours=1):
        raise HTTPException(
            status_code=400,
            detail="La reserva debe realizarse con al menos 1 hora de anticipación"
        )

    # Validar rango horario
    if fecha_fin <= fecha_inicio:
        raise HTTPException(
            status_code=400,
            detail="La hora fin debe ser mayor que la hora inicio"
        )

    # Validar conflictos de horario
    conflicto = db.query(Reserva).filter(
        Reserva.id_espacio == reserva.id_espacio,
        Reserva.fecha == reserva.fecha,
        Reserva.estado != EstadoReserva.RECHAZADA.value,

        and_(
            Reserva.hora_inicio < reserva.hora_fin,
            Reserva.hora_fin > reserva.hora_inicio
        )
    ).first()

    if conflicto:
        raise HTTPException(
            status_code=409,
            detail="El espacio ya está reservado en ese horario"
        )

    # Crear reserva
    db_reserva = Reserva(
        id_usuario=id_usuario,
        id_espacio=reserva.id_espacio,
        fecha=reserva.fecha,
        hora_inicio=reserva.hora_inicio,
        hora_fin=reserva.hora_fin,
        cantidad_asistentes=reserva.cantidad_asistentes,
        estado=EstadoReserva.APROBADA.value
    )

    db.add(db_reserva)
    db.commit()
    db.refresh(db_reserva)

    return db_reserva



# Obtener reserva por id
def get_reserva_by_id(
    db: Session,
    id_reserva: int
):
    return db.query(Reserva).filter(
        Reserva.id_reserva == id_reserva
    ).first()



# Obtener reservas por usuario
def get_reservas_by_usuario(
    db: Session,
    id_usuario: int
):
    return db.query(Reserva).filter(
        Reserva.id_usuario == id_usuario
    ).all()



# Obtener todas las reservas
def get_all_reservas(db: Session):
    return db.query(Reserva).all()


# Listar reservas
def get_reservas(db: Session):
    return db.query(Reserva).all()


# Actualizar estado reserva
def update_estado_reserva(
    db: Session,
    id_reserva: int,
    nuevo_estado: str
):
    reserva = get_reserva_by_id(db, id_reserva)

    if not reserva:
        raise HTTPException(
            status_code=404,
            detail="Reserva no encontrada"
        )

    reserva.estado = nuevo_estado  # type: ignore

    db.commit()
    db.refresh(reserva)

    return reserva