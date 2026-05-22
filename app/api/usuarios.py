from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.usuario import UsuarioCreate
from app.crud import usuario as crud_usuario
from app.auth.auth import require_scopes
from app.db import get_db

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

# Endpoint admin: crear usuario
@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_usuario(
	usuario_in: UsuarioCreate,
	db: Session = Depends(get_db),
	admin = Depends(require_scopes("admin:crear_usuario"))
):
	return crud_usuario.create_usuario(db, usuario_in)

# Endpoint admin: eliminar usuario
@router.delete("/{id_usuario}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(
	id_usuario: int,
	db: Session = Depends(get_db),
	admin = Depends(require_scopes("admin:eliminar_usuario"))
):
	usuario = crud_usuario.delete_usuario(db, id_usuario)
	if not usuario:
		raise HTTPException(status_code=404, detail="Usuario no encontrado")
