from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.espacio import EspacioCreate, EspacioOut
from app.crud import espacio as crud_espacio
from app.auth.auth import require_scopes, get_current_user
from app.db import get_db
from app.models.usuario import Usuario

router = APIRouter(prefix="/espacios", tags=["Espacios"])

# Endpoint público: listar espacios disponibles
@router.get("/", response_model=list[EspacioOut])
def listar_espacios(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Listar todos los espacios disponibles (requiere autenticación)."""
    return crud_espacio.get_all_espacios(db)

# Endpoint admin: crear espacio
@router.post("/", response_model=EspacioOut, status_code=status.HTTP_201_CREATED)
def crear_espacio(
    espacio_in: EspacioCreate,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_scopes("admin:crear_espacio"))
):
    """Crear nuevo espacio (solo admin)."""
    return crud_espacio.create_espacio(db, espacio_in)

# Endpoint admin: eliminar espacio
@router.delete("/{id_espacio}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_espacio(
    id_espacio: int,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_scopes("admin:eliminar_espacio"))
):
    """Eliminar espacio (solo admin)."""
    espacio = crud_espacio.delete_espacio(db, id_espacio)
    if not espacio:
        raise HTTPException(status_code=404, detail="Espacio no encontrado")
    return None
