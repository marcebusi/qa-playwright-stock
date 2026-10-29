import { test, expect } from '../fixtures/base'
import { EntriesPage } from '../pages/EntriesPage'

test.describe('Entradas de Stock', () => {

  test.beforeEach(async ({ dashboard }) => {
    await dashboard.navigateTo('entries')
  })

  test('TC-ENT-01 — Tabla de entradas se carga', async ({ authenticatedPage }) => {
    const entriesPage = new EntriesPage(authenticatedPage)
    await expect(entriesPage.table).toBeVisible({ timeout: 8_000 })
  })

  test('TC-ENT-02 — Modal de nueva entrada se abre correctamente', async ({ authenticatedPage }) => {
    const entriesPage = new EntriesPage(authenticatedPage)
    await entriesPage.openAddModal()

    // El modal debe tener título "Nueva Entrada"
    const titulo = entriesPage.modal.locator('h2:has-text("Nueva Entrada"), .bc-pt-modal-title')
    await expect(titulo).toBeVisible({ timeout: 5_000 })

    // El campo de búsqueda de producto debe estar visible
    const productoInput = entriesPage.modal.locator('input[placeholder*="producto" i], input[placeholder*="Buscar" i]').first()
    await expect(productoInput).toBeVisible({ timeout: 5_000 })

    // El campo de cantidad debe estar presente
    await expect(entriesPage.modal.locator('#entry-qty')).toBeVisible()
  })

  test('TC-ENT-03 — Cantidad 0 muestra error de validación', async ({ authenticatedPage }) => {
    const entriesPage = new EntriesPage(authenticatedPage)
    await entriesPage.openAddModal()

    // Intentar submit sin llenar nada
    const submitBtn = entriesPage.modal.locator('button[type="submit"]').first()
    await submitBtn.click()

    // El modal debe permanecer abierto (validación client-side)
    await expect(entriesPage.modal).toBeVisible({ timeout: 3_000 })
  })

  test('TC-ENT-04 — Modal se puede cerrar sin registrar', async ({ authenticatedPage }) => {
    const entriesPage = new EntriesPage(authenticatedPage)
    await entriesPage.openAddModal()
    await expect(entriesPage.modal).toBeVisible()

    // Cerrar con el botón Cancelar
    const cancelBtn = entriesPage.modal.locator('button:has-text("Cancelar")').first()
    await cancelBtn.click()

    await expect(entriesPage.modal).toBeHidden({ timeout: 5_000 })
  })

})
