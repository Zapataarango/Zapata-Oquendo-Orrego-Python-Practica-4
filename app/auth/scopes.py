SCOPES_BY_ROLE = {
}

def get_scopes_for_role(role: str) -> set[str]:
    return SCOPES_BY_ROLE.get(role, set())