# qa-playwright-stock

Suite E2E con Playwright + TypeScript para **Stock System Obras**.

## Stack
- **Playwright** 1.49 — runner + assertions
- **TypeScript** 5.x — tipado estricto
- **POM** (Page Object Model) — una clase por sección
- **GitHub Actions** — CI en cada push/PR

## Estructura

```
qa-playwright-stock/
├── pages/              # Page Objects
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── ProductsPage.ts
│   ├── EntriesPage.ts
│   └── ExitsPage.ts
├── tests/              # Specs
│   ├── auth.spec.ts    # 7 casos — login/logout/sesión
│   ├── products.spec.ts # 6 casos — CRUD productos
│   ├── entries.spec.ts  # 4 casos — entradas de stock
│   └── exits.spec.ts    # 4 casos — salidas de stock
├── fixtures/
│   └── base.ts         # Fixture de página autenticada
├── .env.test           # Credenciales de prueba
├── playwright.config.ts
└── tsconfig.json
```

## Setup rápido

### 1. Prerrequisitos
- Node.js 18+
- Docker (para PostgreSQL)
- El backend corriendo en `http://localhost:3001`
- El frontend corriendo en `http://localhost:5173`

### 2. Instalar dependencias

```bash
npm install
npx playwright install chromium
```

### 3. Configurar variables de entorno

Editar `.env.test` con las credenciales reales:

```
TEST_ADMIN_EMAIL=admin@stockobra.com
TEST_ADMIN_PASSWORD=admin123
EMPRESA_SLUG=stockobra
```

### 4. Levantar la app

```bash
# Terminal 1 — Backend
cd ../stock-system-obra-main/backend
npm run dev

# Terminal 2 — Frontend
cd ../stock-system-obra-main/frontend
npm run dev
```

## Correr los tests

```bash
# Todos los tests (headless)
npm test

# Con UI visual
npm run test:ui

# Solo smoke tests
npm run test:smoke

# Con navegador visible
npm run test:headed

# Ver último reporte HTML
npm run report
```

## Cobertura — 21 casos de prueba

| Módulo      | Casos | Tags    |
|-------------|-------|---------|
| Auth        | 7     | @smoke  |
| Productos   | 6     | @smoke  |
| Entradas    | 4     | —       |
| Salidas     | 4     | —       |
| **Total**   | **21**|         |

### Casos @smoke (flujo crítico)
- Login exitoso
- Login fallido (credenciales incorrectas / email inexistente / campos vacíos)
- Redirect sin sesión
- Logout
- Sesión persistente tras refresh
- Tabla de productos carga
- Crear producto

## CI/CD

El workflow `.github/workflows/e2e.yml` ejecuta la suite completa en cada push y pull request contra `main`. El reporte HTML queda como artefacto descargable por 30 días.
