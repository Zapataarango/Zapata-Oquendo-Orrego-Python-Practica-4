# 🔐 Sistema de Autenticación JWT con Roles

Tu aplicación FastAPI implementa un sistema completo de autenticación y autorización basado en **JWT (JSON Web Tokens)** con control de acceso por **rol de usuario**.

---

## 📋 Resumen del Sistema

### 1. **Estructura de Roles y Permisos**

```python
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
        "admin:eliminar_espacio"
    }
}
```

---

## 🚀 Flujo de Autenticación

### Paso 1: Login (POST `/auth/token`)

**Solicitud:**
```json
{
  "correo": "usuario@example.com",
  "password": "micontraseña123"
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "rol": "admin"
}
```

El token contiene:
- `sub`: correo del usuario
- `id_usuario`: ID del usuario
- `rol`: rol asignado (admin o usuario)
- `scopes`: lista de permisos permitidos
- `exp`: fecha de expiración (60 minutos por defecto)

---

### Paso 2: Usar el Token en Peticiones

Incluye el token en el header `Authorization`:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:8000/usuarios/perfil/me
```

O en JavaScript/Fetch:

```javascript
const response = await fetch('http://localhost:8000/usuarios/perfil/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🛡️ Protección de Endpoints

### Opción 1: Requerir Scope Específico

```python
from app.auth.auth import require_scopes
from app.models.usuario import Usuario

@router.post("/crear-espacio")
def crear_espacio(
    espacio_in: EspacioCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_scopes("admin:crear_espacio"))
):
    """Solo usuarios con scope 'admin:crear_espacio' pueden llamar este endpoint."""
    # current_user es el usuario autenticado
    return crud_espacio.create_espacio(db, espacio_in)
```

### Opción 2: Solo Requerir Autenticación (sin scope específico)

```python
from app.auth.auth import get_current_user

@router.get("/perfil/me")
def get_mi_perfil(current_user: Usuario = Depends(get_current_user)):
    """Cualquier usuario autenticado puede acceder."""
    return current_user
```

---

## 📚 Ejemplos Completos

### Ejemplo 1: Crear Usuario (requiere admin)

```bash
# 1. Login como admin
curl -X POST http://localhost:8000/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "admin@example.com",
    "password": "admin123"
  }'

# Respuesta:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "token_type": "bearer",
#   "rol": "admin"
# }

# 2. Usar el token para crear usuario
curl -X POST http://localhost:8000/usuarios/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "password": "juan123",
    "rol": "usuario",
    "activo": true
  }'
```

### Ejemplo 2: Ver Mi Perfil

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/usuarios/perfil/me
```

**Respuesta:**
```json
{
  "id_usuario": 1,
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "rol": "usuario",
  "activo": true
}
```

---

## ⚙️ Configuración Necesaria

### Archivo `.env`

```bash
# Clave secreta para firmar los tokens (cambiar en producción!)
SECRET_KEY=tu_clave_super_secreta_aqui_min_32_caracteres

# URL de la base de datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_db

# Duración del token en minutos (configurable en app/auth/auth.py)
# ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## 🔑 Conceptos Clave

| Concepto | Descripción |
|----------|-------------|
| **JWT Token** | Token digital que contiene los datos del usuario e información de seguridad |
| **Bearer Token** | Tipo de token usado en HTTP (Authorization: Bearer \<token\>) |
| **Scope** | Permiso específico (ej: "admin:crear_usuario") |
| **Rol** | Categoría de usuario (admin, usuario) que determina sus scopes |
| **Secret Key** | Clave privada para firmar y verificar tokens |
| **Expiración (exp)** | Tiempo máximo de validez del token |

---

## 🐛 Tratamiento de Errores

### Token Inválido o Expirado
```
Status: 401 Unauthorized
{
  "detail": "Token inválido, mal formado o expirado"
}
```

### Sin Permisos Suficientes
```
Status: 403 Forbidden
{
  "detail": "Permiso insuficiente. Requiere: admin:crear_usuario"
}
```

### Usuario No Autenticado
```
Status: 401 Unauthorized
{
  "detail": "El token no contiene el campo 'sub' (correo)"
}
```

### Usuario Inactivo
```
Status: 401 Unauthorized
{
  "detail": "La cuenta de usuario está desactivada"
}
```

---

## 🔄 Flujo Completo de una Aplicación Cliente

```javascript
// 1. Login
async function login(correo, password) {
  const response = await fetch('/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password })
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('rol', data.rol);
    return data;
  }
  throw new Error('Login fallido');
}

// 2. Guardar token y usarlo en futuras peticiones
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 401) {
    // Token expirado, redirigir a login
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  
  return response;
}

// 3. Usar en componentes
async function crear_usuario(nombre, correo, password) {
  const response = await fetchWithAuth('/usuarios/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo, password, rol: 'usuario', activo: true })
  });
  return response.json();
}
```

---

## 📌 Checklista de Seguridad

- ✅ TOKEN SECRET_KEY está configurado y es único
- ✅ Las contraseñas se hashean con bcrypt antes de guardarse
- ✅ Los tokens se crean solo después de validar usuario + contraseña
- ✅ Los tokens no contienen información sensible (contraseña, etc)
- ✅ Los scopes se validan en cada petición protegida
- ✅ Se valida el estado `activo` del usuario

---

## 🎯 Próximos Pasos

1. **Agregar refresh tokens** para renovar sesiones sin re-loguear
2. **Rate limiting** en el endpoint de login para prevenir ataques de fuerza bruta
3. **Logging de autenticación** para auditar accesos
4. **Roles dinámicos** guardados en la BD en lugar de hardcodeados
5. **2FA (Two-Factor Authentication)** para mayor seguridad
