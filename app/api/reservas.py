from fastapi import Body, APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.reserva import ReservaCreate, ReservaOut, EstadoReserva
from app.crud import reserva as crud_reserva
from app.auth.auth import require_scopes, get_current_user
from app.db import get_db
from app.models.usuario import Usuario
from app.crud import espacio as crud_espacio

router = APIRouter(prefix="/reservas", tags=["Reservas"])

# Endpoint para crear una reserva (usuario autenticado)
@router.post("/", response_model=ReservaOut, status_code=status.HTTP_201_CREATED)
def crear_reserva(
    reserva_in: ReservaCreate,
    db: Session = Depends(get_db),
    user: Usuario = Depends(require_scopes("usuario:crear_reserva"))
):
    """Crear una reserva (solo usuario autenticado) el formato solicitado de hora es 24 horas (HH:MM)."""
    return crud_reserva.create_reserva(
        db=db,
        reserva=reserva_in,
        id_usuario=user.id_usuario # type: ignore
    )

# Endpoint para obtener mis reservas
@router.get("/mis-reservas", response_model=list[ReservaOut])
def mis_reservas(
    db: Session = Depends(get_db),
    user: Usuario = Depends(require_scopes("usuario:ver_reservas"))
):
    """Ver las reservas del usuario autenticado."""
    return crud_reserva.get_reservas_by_usuario(db, user.id_usuario) # type: ignore

# Endpoint para que el admin vea todas las reservas
@router.get("/", response_model=list[ReservaOut])
def todas_las_reservas(
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_scopes("admin:ver_todas_reservas"))
):
    """Ver todas las reservas (solo admin)."""
    return crud_reserva.get_all_reservas(db)

# Endpoint para que el admin cambie el estado de una reserva
@router.patch("/{id_reserva}/estado", response_model=ReservaOut)
def cambiar_estado_reserva(
    id_reserva: int,
    nuevo_estado: EstadoReserva = Body(..., embed=True, example="aprobada"),
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_scopes("admin:gestionar_reservas"))
):
    """Cambiar estado de una reserva (solo admin). Estados válidos: esperando, aprobada, rechazada."""
    reserva = crud_reserva.get_reserva_by_id(db, id_reserva)
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    if reserva.estado != EstadoReserva.ESPERANDO.value: # type: ignore
        raise HTTPException(status_code=400, detail="Solo se puede cambiar el estado de reservas en estado 'esperando'")

    # Si se aprueba la reserva, actualizar el estado del espacio a "reservado"
    if nuevo_estado.value == EstadoReserva.APROBADA.value:
        crud_espacio.update_estado_espacio(db, reserva.id_espacio, "reservado") # type: ignore

    return crud_reserva.update_estado_reserva(db, id_reserva, nuevo_estado.value)
