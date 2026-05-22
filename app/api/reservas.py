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
