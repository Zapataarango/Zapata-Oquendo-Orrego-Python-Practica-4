from sqlalchemy.orm import Session
from app.models.reserva import Reserva
from app.schemas.reserva import ReservaCreate

# Crear reserva
def create_reserva(db: Session, reserva: ReservaCreate):
    db_reserva = Reserva(**reserva.dict())
    db.add(db_reserva)
    db.commit()
    db.refresh(db_reserva)
    return db_reserva

# Obtener reserva por id
def get_reserva_by_id(db: Session, id_reserva: int):
    return db.query(Reserva).filter(Reserva.id_reserva == id_reserva).first()

# Obtener reservas de un usuario
def get_reservas_by_usuario(db: Session, id_usuario: int):
    return db.query(Reserva).filter(Reserva.id_usuario == id_usuario).all()

# Obtener todas las reservas
def get_all_reservas(db: Session):
    return db.query(Reserva).all()

# Listar reservas (legacy)
def get_reservas(db: Session):
    return db.query(Reserva).all()

# Actualizar estado de reserva
def update_estado_reserva(db: Session, id_reserva: int, nuevo_estado: str):
    reserva = get_reserva_by_id(db, id_reserva)
    if reserva:
        reserva.estado = nuevo_estado  # type: ignore[assignment]
        db.commit()
        db.refresh(reserva)
    return reserva
