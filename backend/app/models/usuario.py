from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(150), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    rol = Column(String(50), nullable=False)
    activo = Column(Boolean, default=True, nullable=False)
    reservas = relationship("Reserva", back_populates="usuario")
