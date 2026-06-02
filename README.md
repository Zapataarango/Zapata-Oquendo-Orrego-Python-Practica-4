# Roles en el proyecto:
* Felipe Zapata Arango: Desarrollo de API
* Emmanuel Urrego Gomez: Desarrollo de Frontend
* Samuel Oquendo Quintero: Despliegue

# Explicación de Readme
Este Readme cuenta con la documentación del despliegue y la solución técnica

# Arquitectura y Diseño de la Solución

## 1. Arquitectura de la Solución

### 1.1 Arquitectura General

<img width="2930" height="3905" alt="C4" src="https://github.com/user-attachments/assets/5d43a115-6a36-4d9e-957f-4d6489ae3cb0" />

La solución implementa una arquitectura cliente-servidor compuesta por tres componentes principales:

* **Frontend** desarrollado en React.
* **Backend** desarrollado en FastAPI.
* **Base de Datos** PostgreSQL.

La comunicación entre el frontend y el backend se realiza mediante servicios REST utilizando JSON como formato de intercambio de información. La autenticación se implementa mediante JWT (JSON Web Token) y la autorización mediante permisos (scopes) asociados a roles.

---

### 1.2 Arquitectura Frontend

<img width="4156" height="3694" alt="C3" src="https://github.com/user-attachments/assets/6b1fc104-d3f3-4bdb-ab60-6b7b5baeb7d2" />

El frontend fue desarrollado utilizando React y Vite bajo una arquitectura basada en componentes.

#### Componentes principales

| Componente   | Responsabilidad                 |
| ------------ | ------------------------------- |
| React Router | Navegación entre vistas         |
| AuthContext  | Gestión global de autenticación |
| Axios        | Consumo de servicios REST       |
| Components   | Componentes reutilizables       |
| Pages        | Pantallas del sistema           |

#### Flujo general

```text
Usuario
   ↓
React Router
   ↓
Pages
   ↓
Axios
   ↓
Backend FastAPI
```

---

### 1.3 Arquitectura Backend

<img width="4156" height="3694" alt="C3" src="https://github.com/user-attachments/assets/2d9ab8f9-2734-4b86-83a5-353ec668555a" />

El backend sigue una arquitectura en capas orientada a separar responsabilidades.

#### API Layer

Responsable de exponer los endpoints REST.

```text
api/
├── auth.py
├── usuarios.py
├── espacios.py
└── reservas.py
```

#### Authentication Layer

Gestiona autenticación y autorización.

```text
auth/
├── auth.py
└── scopes.py
```

#### Business Layer

Implementa reglas de negocio y acceso a datos.

```text
crud/
├── usuario.py
├── espacio.py
└── reserva.py
```

#### Persistence Layer

Implementada mediante SQLAlchemy y PostgreSQL.

---

### 1.4 Flujo de Reserva

<img width="8190" height="4365" alt="Flujo de reservas" src="https://github.com/user-attachments/assets/4cb36f2e-fd0e-4197-b95c-aae56b24f0bd" />

El flujo implementado para la gestión de reservas es el siguiente:

1. El usuario autenticado consulta los espacios disponibles.
2. El usuario registra una solicitud de reserva.
3. El sistema ejecuta las validaciones de negocio.
4. La reserva es creada en estado **esperando**.
5. Un administrador aprueba o rechaza la reserva.
6. Un administrador puede cancelar reservas aprobadas o pendientes.

---

# 2. Diseño de Base de Datos y Modelo Entidad-Relación

## 2.1 Modelo Entidad-Relación

<img width="2962" height="3765" alt="Entidad-Relación" src="https://github.com/user-attachments/assets/54570841-b002-425a-9634-0a96af1ec48c" />

---

## 2.2 Entidad Usuario

| Campo         | Tipo        | Restricción  |
| ------------- | ----------- | ------------ |
| id_usuario    | Integer     | PK           |
| nombre        | String(100) | Obligatorio  |
| correo        | String(150) | Único        |
| password_hash | String(255) | Obligatorio  |
| rol           | String(50)  | Obligatorio  |
| activo        | Boolean     | Default True |

---

## 2.3 Entidad Espacio

| Campo      | Tipo    | Restricción |
| ---------- | ------- | ----------- |
| id_espacio | Integer | PK          |
| nombre     | String  | Obligatorio |
| ubicacion  | String  | Obligatorio |
| capacidad  | Integer | Mayor que 0 |
| estado     | String  | Obligatorio |

---

## 2.4 Entidad Reserva

| Campo               | Tipo    | Restricción |
| ------------------- | ------- | ----------- |
| id_reserva          | Integer | PK          |
| id_usuario          | Integer | FK          |
| id_espacio          | Integer | FK          |
| fecha               | Date    | Obligatorio |
| hora_inicio         | Time    | Obligatorio |
| hora_fin            | Time    | Obligatorio |
| cantidad_asistentes | Integer | Mayor que 0 |
| estado              | String  | Obligatorio |

---

## 2.5 Relaciones

```text
Usuario (1) -------- (N) Reserva

Espacio (1) -------- (N) Reserva
```

---

# 3. Estructura de Carpetas, Tecnologías y Librerías

## 3.1 Estructura del Backend

```text
backend/
├── app/
│   ├── api/
│   ├── auth/
│   ├── crud/
│   ├── models/
│   ├── schemas/
│   ├── db.py
│   └── main.py
├── Dockerfile
└── requirements.txt
```

### Descripción

| Carpeta | Responsabilidad                    |
| ------- | ---------------------------------- |
| api     | Endpoints REST                     |
| auth    | JWT y autorización                 |
| crud    | Reglas de negocio y acceso a datos |
| models  | Entidades SQLAlchemy               |
| schemas | Validación mediante Pydantic       |

---

## 3.2 Estructura del Frontend

```text
frontend/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   └── pages/
├── Dockerfile
├── package.json
└── vite.config.js
```

### Descripción

| Carpeta    | Responsabilidad               |
| ---------- | ----------------------------- |
| api        | Configuración Axios           |
| assets     | Recursos gráficos             |
| components | Componentes reutilizables     |
| context    | Estado global y autenticación |
| pages      | Vistas principales            |

---

## 3.3 Tecnologías Backend

| Tecnología  | Uso                    |
| ----------- | ---------------------- |
| FastAPI     | Framework API REST     |
| SQLAlchemy  | ORM                    |
| PostgreSQL  | Base de datos          |
| Pydantic    | Validación             |
| Uvicorn     | Servidor ASGI          |
| Passlib     | Hash de contraseñas    |
| Bcrypt      | Cifrado de contraseñas |
| Python-JOSE | JWT                    |
| Docker      | Contenerización        |

---

## 3.4 Tecnologías Frontend

| Tecnología   | Uso                 |
| ------------ | ------------------- |
| React        | Interfaz de usuario |
| Vite         | Bundler             |
| Axios        | Cliente HTTP        |
| React Router | Navegación          |
| ESLint       | Calidad de código   |

---

# 4. Endpoints Desarrollados

## 4.1 Autenticación

| Método | Endpoint      | Descripción                          |
| ------ | ------------- | ------------------------------------ |
| POST   | `/auth/token` | Inicio de sesión y generación de JWT |

---

## 4.2 Usuarios

| Método | Endpoint                 | Descripción                |
| ------ | ------------------------ | -------------------------- |
| POST   | `/usuarios`              | Crear usuario              |
| DELETE | `/usuarios/{id_usuario}` | Eliminar usuario           |
| GET    | `/usuarios/perfil/me`    | Obtener perfil autenticado |
| GET    | `/usuarios`              | Listar usuarios            |

---

## 4.3 Espacios

| Método | Endpoint                 | Descripción                    |
| ------ | ------------------------ | ------------------------------ |
| GET    | `/espacios/disponibles`  | Consultar espacios disponibles |
| GET    | `/espacios`              | Listar todos los espacios      |
| POST   | `/espacios`              | Crear espacio                  |
| DELETE | `/espacios/{id_espacio}` | Eliminar espacio               |

---

## 4.4 Reservas

| Método | Endpoint                          | Descripción                  |
| ------ | --------------------------------- | ---------------------------- |
| POST   | `/reservas`                       | Crear reserva                |
| GET    | `/reservas/mis-reservas`          | Consultar reservas propias   |
| GET    | `/reservas`                       | Consultar todas las reservas |
| PATCH  | `/reservas/{id_reserva}/estado`   | Aprobar o rechazar reserva   |
| PATCH  | `/reservas/{id_reserva}/cancelar` | Cancelar reserva             |

---

# 5. Modelo de Autenticación JWT y Roles Implementados

## 5.1 Proceso de Autenticación

```text
Usuario
   ↓
Login
   ↓
Validación credenciales
   ↓
Generación JWT
   ↓
Almacenamiento Frontend
   ↓
Authorization: Bearer Token
```

---

## 5.2 Rol Usuario

Permisos:

* usuario:crear_reserva
* usuario:ver_reservas

Capacidades:

* Crear reservas.
* Consultar reservas propias.

---

## 5.3 Rol Administrador

Permisos:

* usuario:crear_reserva
* usuario:ver_reservas
* admin:gestionar_reservas
* admin:ver_todas_reservas
* admin:cancelar_reserva
* admin:crear_usuario
* admin:eliminar_usuario
* admin:crear_espacio
* admin:eliminar_espacio
* admin:listar_espacio

Capacidades:

* Gestionar usuarios.
* Gestionar espacios.
* Aprobar reservas.
* Rechazar reservas.
* Cancelar reservas.
* Consultar todas las reservas.

---

# 6. Reglas de Negocio Implementadas y Validación de Reservas

## 6.1 Gestión de Espacios

### RN-01: Validación de capacidad

La capacidad de un espacio debe ser mayor que cero.

```python
capacidad > 0
```

---

## 6.2 Gestión de Reservas

### RN-02: Existencia del espacio

No se pueden crear reservas sobre espacios inexistentes.

### RN-03: Disponibilidad del espacio

No se permiten reservas sobre espacios en estado:

* inactivo
* mantenimiento
* no_disponible

### RN-04: Capacidad máxima

La cantidad de asistentes no puede superar la capacidad del espacio.

### RN-05: Anticipación mínima

Las reservas deben realizarse con al menos 24 horas de anticipación.

### RN-06: Consistencia horaria

La hora de finalización debe ser mayor que la hora de inicio.

### RN-07: Restricción de horarios

| Día             | Horario permitido |
| --------------- | ----------------- |
| Lunes a Viernes | 07:00 - 20:00     |
| Sábado          | 08:00 - 12:00     |
| Domingo         | No permitido      |

### RN-08: Solapamiento de reservas

No pueden existir reservas para el mismo espacio y horario cuando el estado sea:

* esperando
* aprobada

Las reservas rechazadas no generan bloqueo.

### RN-09: Estado inicial

Toda reserva inicia con estado:

```text
esperando
```

### RN-10: Gestión administrativa

Solo las reservas en estado **esperando** pueden ser aprobadas o rechazadas.

### RN-11: Cancelación de reservas rechazadas

No se permite cancelar reservas rechazadas.

### RN-12: Cancelación duplicada

No se permite cancelar reservas previamente canceladas.

---

# 7. Instrucciones para Ejecutar en Modo Desarrollo

## 7.1 Requisitos

* Docker Desktop
* Docker Compose
* Git

---

## 7.2 Clonar repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd Zapata-Oquendo-Orrego-Python-Practica-4
```

---

## 7.3 Construir contenedores

```bash
docker compose build
```

---

## 7.4 Iniciar aplicación

```bash
docker compose up
```

---

## 7.5 Accesos

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:8000
```

### Swagger

```text
http://localhost:8000/docs
```

### PostgreSQL

```text
localhost:5432
```

---

## 7.6 Detener servicios

```bash
docker compose down
```
