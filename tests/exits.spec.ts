import { test, expect } from '../fixtures/base'
import { ExitsPage } from '../pages/ExitsPage'

test.describe('Salidas de Stock', () => {

  test.beforeEach(async ({ dashboard }) => {
    await dashboard.navigateTo('exits')
  })

  test('TC-SAL-01 — Tabla de salidas se carga', async ({ authenticatedPage }) => {
    const exitsPage = new ExitsPage(authenticatedPage)
    await expect(exitsPage.table).toBeVisible({ timeout: 8_000 })
  })

  test('TC-SAL-02 — Modal de nueva salida se abre correctamente', async ({ authenticatedPage }) => {
    const exitsPage = new ExitsPage(authenticatedPage)
    await exitsPage.openAddModal()

    // El modal debe tener título "Nueva Salida"
    const titulo = exitsPage.modal.locator('h2:has-text("Nueva Salida"), .bc-pt-modal-title')
    await expect(titulo).toBeVisible({ timeout: 5_000 })

    // El campo de búsqueda de producto debe estar visible
    const productoInput = exitsPage.modal.locator('input[placeholder*="producto" i], input[placeholder*="Buscar" i]').first()
    await expect(productoInput).toBeVisible({ timeout: 5_000 })
  })

  test('TC-SAL-03 — Submit sin producto muestra validación', async ({ authenticatedPage }) => {
    const exitsPage = new ExitsPage(authenticatedPage)
    await exitsPage.openAddModal()

    // Intentar submit sin seleccionar producto
    const submitBtn = exitsPage.modal.locator('button[type="submit"]').first()
    await submitBtn.click()

    // El modal debe permanecer abierto
    await expect(exitsPage.modal).toBeVisible({ timeout: 3_000 })
  })

  test('TC-SAL-04 — Modal se puede cerrar sin registrar', async ({ authenticatedPage }) => {
    const exitsPage = new ExitsPage(authenticatedPage)
    await exitsPage.openAddModal()
    await expect(exitsPage.modal).toBeVisible()

    const cancelBtn = exitsPage.modal.locator('button:has-text("Cancelar")').first()
    await cancelBtn.click()

    await expect(exitsPage.modal).toBeHidden({ timeout: 5_000 })
  })

})
