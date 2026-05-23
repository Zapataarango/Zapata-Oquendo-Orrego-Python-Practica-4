from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate
from app.auth.auth import hash_password

# Crear usuario
def create_usuario(db: Session, usuario: UsuarioCreate):
    hashed_pwd = hash_password(usuario.password)
    db_usuario = Usuario(
        nombre=usuario.nombre,
        correo=usuario.correo,
        rol=usuario.rol,
        password_hash=hashed_pwd,
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Obtener usuario por correo
def get_usuario_by_correo(db: Session, correo: str):
    return db.query(Usuario).filter(Usuario.correo == correo).first()

# Listar usuarios
def get_usuarios(db: Session):
    return db.query(Usuario).all()

# Eliminar usuario
def delete_usuario(db: Session, id_usuario: int):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if usuario:
        db.delete(usuario)
        db.commit()
    return usuario
