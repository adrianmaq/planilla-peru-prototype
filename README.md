# Sistema de Planillas Perú - Prototipo funcional

Este repositorio contiene un prototipo funcional para gestionar el Libro de Planillas y la Planilla de Remuneraciones en Perú, con foco en:

- registro de trabajadores
- configuración de parámetros laborales y pensionarios por vigencia
- cálculo y validación antes de cerrar una planilla
- aprobación y auditoría de cambios
- reportes básicos por trabajador y por área
- seguridad básica con roles y JWT

## Arquitectura propuesta

### Frontend
- React + Vite + JavaScript
- Interfaz moderna para escritorio y móvil
- Formularios para trabajadores, parámetros y planillas
- Dashboard con indicadores clave

### Backend
- Node.js + Express
- Autenticación JWT
- Control de acceso por roles
- Validación y auditoría de eventos
- APIs para trabajadores, planillas y reportes

### Base de datos
- SQLite para la versión prototipo local
- Tablas para usuarios, trabajadores, parámetros, planillas, auditoría y reportes
- Estructura preparada para migrar a PostgreSQL en producción

## Modelo de datos base

Entidades principales:
- usuarios
- roles
- trabajadores
- contratos
- áreas
- parámetros laborales y pensionarios
- planillas
- detalle de planillas
- auditoría

Concepto clave:
- No se utilizan tasas fijas ni reglas legales inventadas.
- Los parámetros se configuran por tipo, origen y fecha de vigencia.
- Antes de calcular o cerrar una planilla, el sistema valida campos requeridos y solicita aprobación.

## Roles incluidos en el prototipo

- admin
- rrhh
- contador
- consulta

## Usuarios de prueba

- admin@empresa.test / admin123
- rrhh@empresa.test / rrhh123
- contador@empresa.test / contador123
- consulta@empresa.test / consulta123

## Ejecutar el prototipo

### 1) Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

El backend quedará en:
- http://localhost:4000

### 2) Frontend

En una terminal distinta:

```bash
cd client
npm install
npm run dev -- --host 0.0.0.0
```

La interfaz quedará en:
- http://localhost:5173

## Pruebas

```bash
cd server
npm test
```

## Endpoints principales

- POST /api/auth/login
- GET /api/auth/me
- GET /api/workers
- POST /api/workers
- GET /api/parameters
- POST /api/parameters
- GET /api/payrolls
- POST /api/payrolls
- POST /api/payrolls/:id/review
- POST /api/payrolls/:id/approve
- GET /api/reports/summary

## Validaciones importantes

El sistema no calcula una planilla si:
- falta el mes o la fecha del periodo
- faltan trabajadores
- falta el sueldo base o datos mínimos del trabajador
- no hubo configuración de parámetro para el tipo requerido
- hay inconsistencias en los datos de asistencia, descuentos o conceptos

Antes de aprobar una planilla, se requiere revisión o aprobación por un usuario autorizado.

## Siguientes etapas recomendadas

1. Integrar importación de Excel/CSV
2. Añadir autenticación con permisos más finos por módulo
3. Implementar exportación a Excel, PDF y CSV
4. Añadir copia de seguridad y auditoría más detallada
5. Migrar a PostgreSQL y Prisma en producción

## Nota legal

Este prototipo no sustituye asesoría legal ni contable profesional. Se deja la configuración de parámetros para que el usuario complete la fuente y vigencia conforme a la normativa aplicable en cada caso.
