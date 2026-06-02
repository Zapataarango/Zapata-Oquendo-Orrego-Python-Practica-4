from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud, schemas
from app.schemas.usuario import UsuarioCreate, UsuarioOut
from app.crud import usuario as crud_usuario
from app.auth.auth import require_scopes, get_current_user
from app.db import get_db
from app.models.usuario import Usuario

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

# Endpoint admin: crear usuario
@router.post("/", response_model=UsuarioOut, status_code=status.HTTP_201_CREATED)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    """Roles válidos: esperando, aprobada, rechazada."""
    return crud_usuario.create_usuario(db, usuario)

# Endpoint admin: eliminar usuario
@router.delete("/{id_usuario}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(
    id_usuario: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_scopes("admin:eliminar_usuario"))
):
    """Eliminar usuario (requiere rol admin)."""
    usuario = crud_usuario.delete_usuario(db, id_usuario)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return None

# Endpoint: obtener mi perfil
@router.get("/perfil/me", response_model=UsuarioOut)
def get_mi_perfil(current_user: Usuario = Depends(get_current_user)):
    """Obtener datos del usuario autenticado."""
    return current_user

# Endpoint admin: listar usuarios
@router.get("/", response_model=list[UsuarioOut])
def listar_usuarios(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Listar todos los usuarios (requiere autenticación)."""
    return crud_usuario.get_usuarios(db)