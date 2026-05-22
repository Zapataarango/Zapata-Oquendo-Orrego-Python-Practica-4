
SCOPES_BY_ROLE = {
    "usuario": {
        "usuario:crear_reserva",
        "usuario:ver_reservas"
    },
    "admin": {
        "usuario:crear_reserva",
        "usuario:ver_reservas",
        "admin:gestionar_reservas",
        "admin:ver_todas_reservas"
    }
}

def get_scopes_for_role(role: str) -> set[str]:
    return SCOPES_BY_ROLE.get(role, set())