from sqlalchemy.orm import Session
from app.models.espacio import Espacio
from app.schemas.espacio import EspacioCreate
from fastapi import HTTPException

# Crear espacio
def create_espacio(db: Session, espacio: EspacioCreate):

    if espacio.capacidad <= 0:
        raise HTTPException(
            status_code=400,
            detail="La capacidad debe ser mayor a 0"
        )

    db_espacio = Espacio(**espacio.dict())

    db.add(db_espacio)
    db.commit()
    db.refresh(db_espacio)

    return db_espacio

# Eliminar espacio
def delete_espacio(db: Session, id_espacio: int):
    espacio = db.query(Espacio).filter(Espacio.id_espacio == id_espacio).first()
    if espacio:
        db.delete(espacio)
        db.commit()
    return espacio

# Obtener todos los espacios
def get_all_espacios(db: Session):
    return db.query(Espacio).all()

# Obtener espacios disponibles
def get_espacios_disponibles(db: Session):
    return db.query(Espacio).filter(Espacio.estado == "disponible").all()

# Listar espacios (legacy)
def get_espacios(db: Session):
    return db.query(Espacio).all()

# Actualizar estado de un espacio
def update_estado_espacio(db: Session, id_espacio: int, nuevo_estado: str):
    espacio = db.query(Espacio).filter(Espacio.id_espacio == id_espacio).first()
    if espacio:
        espacio.estado = nuevo_estado # type: ignore
        db.commit()
        db.refresh(espacio)
    return espacio