from datetime import datetime, timedelta, timezone
import os
from jose import jwt, JWTError
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Usuario
from app.auth.scopes import get_scopes_for_role

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

if SECRET_KEY is None:
    raise RuntimeError("Falta configurar SECRET_KEY en el archivo .env")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = data.copy()
    payload.update({"exp": expire})

    token = jwt.encode(payload, SECRET_KEY or "", algorithm=ALGORITHM)
    return token

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY or "", algorithms=[ALGORITHM])
        correo = payload.get("sub")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token inválido, mal formado o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if correo is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="El token no contiene el campo 'sub' (correo)"
        )

    user = db.query(Usuario).filter(Usuario.correo == correo).first()

    if user is None:
        raise HTTPException(status_code=401, detail="Usuario no encontrado en la base de datos")
    
    if user.activo is False:
        raise HTTPException(status_code=401, detail="La cuenta de usuario está desactivada")

    return user

def require_scopes(required_scope: str):

    def dependency(user=Depends(get_current_user)):
        user_scopes = get_scopes_for_role(user.rol)
        
        if required_scope not in user_scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permiso insuficiente. Requiere: {required_scope}",
            )

        return user

    return dependency
