from fastapi import FastAPI
from app.api import auth, usuarios, reservas, espacios
from app.db import engine, Base
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Reservas",
    version="1.0.0",
    swagger_ui_parameters={"defaultModelsExpandDepth": -1})

# Configuración de CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(reservas.router)
app.include_router(espacios.router)
