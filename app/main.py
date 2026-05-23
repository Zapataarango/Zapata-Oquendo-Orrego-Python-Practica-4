from fastapi import FastAPI
from app.api import auth, usuarios, reservas, espacios
from app.db import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Reservas",
    description="API para el control de soportes técnicos y laboratorios",
    version="1.0.0",
    swagger_ui_parameters={"defaultModelsExpandDepth": -1})

# Registrar routers
app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(reservas.router)
app.include_router(espacios.router)
