
from typing import TYPE_CHECKING, Union
from sqlalchemy import Column  # pragma: no cover

SCOPES_BY_ROLE = {
    "usuario": {
        "usuario:crear_reserva",
        "usuario:ver_reservas"
    },
    "admin": {
        "usuario:crear_reserva",
        "usuario:ver_reservas",
        "admin:gestionar_reservas",
        "admin:ver_todas_reservas",
        "admin:crear_usuario",
        "admin:eliminar_usuario",
        "admin:crear_espacio",
        "admin:eliminar_espacio",
        "admin:listar_espacio"
    }
}

def get_scopes_for_role(role: Union[str, "Column[str]"]) -> set[str]:
    """Retorna los permisos (scopes) asociados a un rol.
    
    Acepta un string o un atributo Column de SQLAlchemy.
    """
    # En tiempo de ejecución, convertir a string si es necesario
    role_value = str(role) if not isinstance(role, str) else role
    return SCOPES_BY_ROLE.get(role_value, set())