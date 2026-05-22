from fastapi import Body
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.reserva import ReservaCreate, ReservaOut
from app.crud import reserva as crud_reserva
from app.auth.auth import require_scopes, get_current_user
from app.db import get_db

router = APIRouter(prefix="/reservas", tags=["reservas"])

# Endpoint para crear una reserva inicial (usuario autenticado)
@router.post("/", response_model=ReservaOut, status_code=status.HTTP_201_CREATED)
def crear_reserva(
	reserva_in: ReservaCreate,
	db: Session = Depends(get_db),
	user = Depends(require_scopes("usuario:crear_reserva"))
):
	# Forzar que la reserva sea del usuario autenticado
	reserva_data = reserva_in.dict()
	reserva_data["id_usuario"] = user.id_usuario
	reserva_data["estado"] = "esperando"
	reserva_crear = ReservaCreate(**reserva_data)
	return crud_reserva.create_reserva(db, reserva_crear)


# Endpoint para que el admin cambie el estado de una reserva
@router.patch("/{id_reserva}/estado", response_model=ReservaOut)
def cambiar_estado_reserva(
	id_reserva: int,
	nuevo_estado: str = Body(..., embed=True, example="aprobada"),
	db: Session = Depends(get_db),
	admin = Depends(require_scopes("admin:gestionar_reservas"))
):
	reserva = crud_reserva.get_reserva_by_id(db, id_reserva)
	if not reserva:
		raise HTTPException(status_code=404, detail="Reserva no encontrada")
	if reserva.estado != "esperando":
		raise HTTPException(status_code=400, detail="Solo se puede cambiar el estado de reservas en estado 'esperando'")
	if nuevo_estado not in ["aprobada", "rechazada"]:
		raise HTTPException(status_code=400, detail="Estado no válido. Debe ser 'aprobada' o 'rechazada'")
	return crud_reserva.update_estado_reserva(db, id_reserva, nuevo_estado)
