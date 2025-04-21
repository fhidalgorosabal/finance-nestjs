# FinanceNestJS (NestJS)

**FinanceNestJS** es una API RESTful desarrollada con **NestJS** que proporciona servicios backend para integrarse con la aplicación frontend (**FinanceApp**). Esta versión ha sido diseñada desde cero utilizando **TypeScript** y el framework **NestJS**, manteniendo la lógica y estructura funcional de la versión original desarrollada en **Laravel 9**.

---

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Nest CLI](https://docs.nestjs.com/cli/overview)  
  `npm install -g @nestjs/cli`

---

## Instalación y configuración

1. Clona este repositorio:  
   `git clone https://github.com/fhidalgorosabal/backend-finance-app-nestjs.git`

2. Accede a la carpeta del proyecto:  
   `cd backend-finance-app-nestjs`

3. Copia el archivo `.env.example` a `.env` y configura las variables de entorno.

4. Instala las dependencias del proyecto: `npm install`

5. Configura la base de datos: `npx prisma migrate dev --name init && npx prisma generate`

6. Ejecuta la aplicación: `npm run start:dev` (desarrollo) o `npm run build && npm run start:prod` (producción)

---

## Endpoints principales

### Autenticación
- **POST** `/register`: Registrar un nuevo usuario.
- **POST** `/login`: Iniciar sesión.
- **GET** `/profile`: Obtener la información del usuario autenticado.
- **POST** `/refresh`: Actualizar el token de autenticación.
- **POST** `/logout`: Cerrar sesión.

### Gestión de conceptos
- **GET** `/concept`: Listar todos los conceptos.
- **POST** `/concept`: Crear un nuevo concepto.
- **GET** `/concept/{id}`: Obtener los detalles de un concepto específico.
- **PUT** `/concept/{id}`: Actualizar un concepto existente.
- **DELETE** `/concept/{id}`: Eliminar un concepto.
- **POST** `/concept/list`: Obtener una lista filtrada de conceptos.

### Gestión de monedas
- **GET** `/currency`: Listar todas las monedas.
- **POST** `/currency`: Crear una nueva moneda.
- **GET** `/currency/{id}`: Obtener los detalles de una moneda específica.
- **PUT** `/currency/{id}`: Actualizar una moneda existente.
- **DELETE** `/currency/{id}`: Eliminar una moneda.
- **POST** `/currency/list`: Obtener una lista filtrada de monedas.
- **GET** `/currency/default-currency/{company_id}`: Obtener la moneda por defecto para una empresa específica.
- **POST** `/currency/default-currency`: Establecer una moneda como predeterminada.

### Gestión de recibos
- **GET** `/receipt`: Listar todos los recibos.
- **POST** `/receipt`: Crear un nuevo recibo.
- **GET** `/receipt/{id}`: Obtener los detalles de un recibo específico.
- **PUT** `/receipt/{id}`: Actualizar un recibo existente.
- **DELETE** `/receipt/{id}`: Eliminar un recibo.
- **POST** `/receipt/list`: Obtener una lista filtrada de recibos.

### Gestión de cuentas
- **GET** `/account`: Listar todas las cuentas.
- **POST** `/account`: Crear una nueva cuenta.
- **GET** `/account/{id}`: Obtener los detalles de una cuenta específica.
- **PUT** `/account/{id}`: Actualizar una cuenta existente.
- **DELETE** `/account/{id}`: Eliminar una cuenta.
- **POST** `/account/list`: Obtener una lista filtrada de cuentas.

### Gestión de bancos
- **GET** `/bank`: Listar todos los bancos.
- **POST** `/bank`: Crear un nuevo banco.
- **GET** `/bank/{id}`: Obtener los detalles de un banco específico.
- **PUT** `/bank/{id}`: Actualizar un banco existente.
- **DELETE** `/bank/{id}`: Eliminar un banco.

### Configuración
- **POST** `/setting`: Obtener la configuración actual.
- **POST** `/setting/change-month`: Cambiar el mes activo en el sistema.
- **POST** `/setting/close-year`: Cerrar el año financiero.

### Tablero de control (Dashboard)
- **POST** `/dashboard/get-month-total`: Obtener el total de ingresos y gastos del mes actual.
- **POST** `/dashboard/get-month-concepts`: Obtener los conceptos asociados al mes actual.
- **POST** `/dashboard/get-ingress-expenses-month`: Obtener ingresos y gastos por mes.

---

## Autor

Desarrollado por: Fernando Hidalgo Rosabal.

---

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](https://opensource.org/licenses/MIT).

---
