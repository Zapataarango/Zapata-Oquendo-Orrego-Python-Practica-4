from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.espacio import EspacioCreate
from app.crud import espacio as crud_espacio
from app.auth.auth import require_scopes
from app.db import get_db

router = APIRouter(prefix="/espacios", tags=["Espacios"])

# Endpoint admin: crear espacio
@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_espacio(
    espacio_in: EspacioCreate,
    db: Session = Depends(get_db),
    admin = Depends(require_scopes("admin:crear_espacio"))
):
    return crud_espacio.create_espacio(db, espacio_in)

# Endpoint admin: eliminar espacio
@router.delete("/{id_espacio}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_espacio(
    id_espacio: int,
    db: Session = Depends(get_db),
    admin = Depends(require_scopes("admin:eliminar_espacio"))
):
    espacio = crud_espacio.delete_espacio(db, id_espacio)
    if not espacio:
        raise HTTPException(status_code=404, detail="Espacio no encontrado")
