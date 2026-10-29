import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? 'admin@stockobra.com'
const ADMIN_PASS  = process.env.TEST_ADMIN_PASSWORD ?? 'admin123'

test.describe('Autenticación @smoke', () => {

  test('TC-AUTH-01 — Login exitoso con credenciales válidas', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await loginPage.login(ADMIN_EMAIL, ADMIN_PASS)
    await loginPage.waitForDashboard()

    await expect(page).toHaveURL(/dashboard|home|products/)
  })

  test('TC-AUTH-02 — Login falla con contraseña incorrecta', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await loginPage.login(ADMIN_EMAIL, 'contraseña-incorrecta-999')

    // Debe quedarse en /login y mostrar error
    await expect(page).toHaveURL('/login')
    await loginPage.expectError()
  })

  test('TC-AUTH-03 — Login falla con email inexistente', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await loginPage.login('noexiste@fake.com', 'cualquier123')

    await expect(page).toHaveURL('/login')
    await loginPage.expectError()
  })

  test('TC-AUTH-04 — Login con campos vacíos no navega', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await loginPage.submitButton.click()

    await expect(page).toHaveURL('/login')
  })

  test('TC-AUTH-05 — Ruta protegida redirige al login sin sesión', async ({ page }) => {
    // Navegar directamente al dashboard sin token
    const slug = process.env.EMPRESA_SLUG ?? 'stockobra'
    await page.goto(`/${slug}/dashboard`)

    await expect(page).toHaveURL('/login', { timeout: 8_000 })
  })

  test('TC-AUTH-06 — Logout cierra la sesión correctamente', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboard = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASS)
    await loginPage.waitForDashboard()

    await dashboard.logout()

    await expect(page).toHaveURL('/login', { timeout: 8_000 })
  })

  test('TC-AUTH-07 — Sesión persiste tras refresh', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASS)
    await loginPage.waitForDashboard()

    const urlAntes = page.url()
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Debe seguir en el dashboard, no redirigir a login
    await expect(page).not.toHaveURL('/login')
    expect(page.url()).toBe(urlAntes)
  })

})
