# Exchange

Frontend en Angular para consumir la API del proyecto `../Exchange`.

## Requisitos

- Node.js 20+
- npm 10+
- API de Exchange ejecutándose en `https://localhost:44373`

## Desarrollo

Instalar dependencias:

```bash
npm install
```

Levantar el frontend:

```bash
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

## Configuración de API

La URL base de la API está configurada en `src/environments/environment.ts`:

- API: `https://localhost:44373/api`

El frontend consume directamente los endpoints:

- `GET /api/TipoCambio`
- `GET /api/TipoCambio/{id}`
- `POST /api/TipoCambio`
- `PUT /api/TipoCambio/{id}`
- `DELETE /api/TipoCambio/{id}`
- `POST /api/Conversion`

Si la API corre en otra URL, actualiza `apiUrl` en `src/environments/environment.ts`.

## Funcionalidades

- **Conversión**: convierte un monto entre dos monedas usando `POST /api/Conversion`.
- **Tipos de cambio**: CRUD completo para administrar pares de moneda y su valor de cambio sobre `/api/TipoCambio`.

## Build

```bash
npm run build
```

Los artefactos se generan en `dist/exchange/`.
