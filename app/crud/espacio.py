from sqlalchemy.orm import Session
from app.models.espacio import Espacio
from app.schemas.espacio import EspacioCreate

# Crear espacio
def create_espacio(db: Session, espacio: EspacioCreate):
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

# Listar espacios (legacy)
def get_espacios(db: Session):
    return db.query(Espacio).all()
