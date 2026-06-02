from datetime import datetime, timedelta, time

from fastapi import HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.models.espacio import Espacio
from app.models.reserva import Reserva
from app.schemas.reserva import EstadoReserva, ReservaCreate

# =========================
# Crear reserva
# =========================
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

  
    # Regla G:
    # Validar estado del espacio
    estados_bloqueados = [
        "inactivo",
        "mantenimiento",
        "no_disponible"
    ]

    if espacio.estado in estados_bloqueados:  # type: ignore
        raise HTTPException(
            status_code=400,
            detail="El espacio no está disponible para reservas"
        )

  
    # Regla H:
    # Validar capacidad máxima

    if reserva.cantidad_asistentes > espacio.capacidad:  # type: ignore
        raise HTTPException(
            status_code=400,
            detail=f"La capacidad máxima del espacio es {espacio.capacidad}"
        )

  
    # Construir fechas
    fecha_inicio = datetime.combine(
        reserva.fecha,
        reserva.hora_inicio
    )

    fecha_fin = datetime.combine(
        reserva.fecha,
        reserva.hora_fin
    )

    ahora = datetime.now()

  
    # Regla D:
    # 24 horas anticipación
    if fecha_inicio < ahora + timedelta(hours=24):
        raise HTTPException(
            status_code=400,
            detail="La reserva debe realizarse con mínimo 24 horas de anticipación"
        )

  
    # Regla F:
    # Hora inicio < hora fin
    if fecha_fin <= fecha_inicio:
        raise HTTPException(
            status_code=400,
            detail="La hora fin debe ser mayor que la hora inicio"
        )

  
    # Regla E:
    # Validar horarios permitidos
    dia_semana = reserva.fecha.weekday()

    # Lunes a viernes
    if dia_semana in [0, 1, 2, 3, 4]:

        hora_min = time(7, 0)
        hora_max = time(20, 0)

        if (
            reserva.hora_inicio < hora_min or
            reserva.hora_fin > hora_max
        ):
            raise HTTPException(
                status_code=400,
                detail="Horario permitido lunes-viernes: 07:00 - 20:00"
            )

    # Sábado
    elif dia_semana == 5:

        hora_min = time(8, 0)
        hora_max = time(12, 0)

        if (
            reserva.hora_inicio < hora_min or
            reserva.hora_fin > hora_max
        ):
            raise HTTPException(
                status_code=400,
                detail="Horario permitido sábado: 08:00 - 12:00"
            )

    # Domingo
    else:
        raise HTTPException(
            status_code=400,
            detail="No se permiten reservas los domingos"
        )

  
    # Regla C + I:
    # Validar solapamiento
    # Esperando y aprobada bloquean
    # Rechazada NO bloquea
    conflicto = db.query(Reserva).filter(
        Reserva.id_espacio == reserva.id_espacio,
        Reserva.fecha == reserva.fecha,

        Reserva.estado.in_([
            EstadoReserva.ESPERANDO.value,
            EstadoReserva.APROBADA.value
        ]),

        and_(
            Reserva.hora_inicio < reserva.hora_fin,
            Reserva.hora_fin > reserva.hora_inicio
        )
    ).first()

    if conflicto:
        raise HTTPException(
            status_code=409,
            detail="Ya existe una reserva para ese espacio en el horario indicado"
        )

  
    # Regla I:
    # Estado inicial esperando

    db_reserva = Reserva(
        id_usuario=id_usuario,
        id_espacio=reserva.id_espacio,
        fecha=reserva.fecha,
        hora_inicio=reserva.hora_inicio,
        hora_fin=reserva.hora_fin,
        cantidad_asistentes=reserva.cantidad_asistentes,
        estado=EstadoReserva.ESPERANDO.value
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

    estados_validos = [
        EstadoReserva.APROBADA.value,
        EstadoReserva.RECHAZADA.value
    ]

    if nuevo_estado not in estados_validos:
        raise HTTPException(
            status_code=400,
            detail="Estado inválido"
        )

    if reserva.estado != EstadoReserva.ESPERANDO.value: # type: ignore
        raise HTTPException(
            status_code=400,
            detail="Solo se pueden gestionar reservas en estado esperando"
        )

    reserva.estado = nuevo_estado  # type: ignore

    db.commit()
    db.refresh(reserva)

    return reserva

# Cancelar reserva (cambia a estado cancelada)
def cancel_reserva(
    db: Session,
    id_reserva: int
):
    reserva = db.query(Reserva).filter(
        Reserva.id_reserva == id_reserva
    ).first()

    if not reserva:
        raise HTTPException(
            status_code=404,
            detail="Reserva no encontrada"
        )

    # No permitir cancelar rechazadas
    if reserva.estado == EstadoReserva.RECHAZADA.value: # type: ignore
        raise HTTPException(
            status_code=400,
            detail="No se puede cancelar una reserva rechazada"
        )

    # No permitir cancelar canceladas
    if reserva.estado == EstadoReserva.CANCELADA.value: # type: ignore
        raise HTTPException(
            status_code=400,
            detail="La reserva ya está cancelada"
        )

    # Solo esperando/aprobada
    estados_cancelables = [
        EstadoReserva.ESPERANDO.value,
        EstadoReserva.APROBADA.value
    ]

    if reserva.estado not in estados_cancelables:
        raise HTTPException(
            status_code=400,
            detail="La reserva no puede cancelarse"
        )

    reserva.estado = EstadoReserva.CANCELADA.value  # type: ignore

    db.commit()
    db.refresh(reserva)

    return reserva