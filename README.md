Mi Boleta Frontend

Aplicación web desarrollada con Next.js, React y TypeScript para administrar rifas, loterías, sorteos y boletas en un solo lugar.

Permite a los usuarios:

registrarse e iniciar sesión,
guardar sus boletas,
consultar sorteos,
filtrar información,
administrar tickets,
y visualizar próximos juegos y estadísticas.
Tecnologías utilizadas
Next.js (App Router)
React
TypeScript
Zustand
Axios
CSS Modules + CSS tradicional
Clean Architecture
JWT Authentication
Arquitectura del proyecto

El proyecto sigue una estructura basada en Clean Architecture.

src/
├── app/
│   ├── admin/
│   ├── login/
│   ├── register/
│   ├── tickets/
│   └── layout.tsx
│
├── features/
│   ├── auth/
│   ├── tickets/
│   └── users/
│
├── shared/
│   ├── infrastructure/
│   └── presentation/
Funcionalidades implementadas
Autenticación
Registro de usuarios
Inicio de sesión
Logout
Persistencia de sesión
Manejo de JWT
Protección de rutas
Middleware de autenticación
Roles (user y admin)
Gestión de tickets

CRUD completo de:

rifas,
loterías,
sorteos,
boletas.

Cada ticket incluye:

nombre del sorteo,
número jugado,
fecha,
valor apostado,
lugar de compra,
estado,
notas adicionales.
Dashboard
Total de juegos registrados
Juegos pendientes
Próximos sorteos
Historial de tickets
Panel de administrador
Visualización global de tickets
Búsqueda avanzada
Filtros por:
estado,
tipo,
búsqueda textual
Paginación
Restricción por rol admin
Manejo de estado

Se utiliza Zustand para:

autenticación,
persistencia de sesión,
estado global.
Consumo API

La aplicación consume una API REST construida con:

Express
Prisma
PostgreSQL
JWT
Variables de entorno

Crear un archivo .env.local

NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
Instalación

Clonar repositorio:

git clone <repo-url>

Instalar dependencias:

npm install

Ejecutar proyecto:

npm run dev

La aplicación correrá en:

http://localhost:3000
