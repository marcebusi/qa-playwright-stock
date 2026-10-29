import { test, expect } from '../fixtures/base'
import { ProductsPage } from '../pages/ProductsPage'
import { DashboardPage } from '../pages/DashboardPage'

test.describe('Gestión de Productos @smoke', () => {

  test.beforeEach(async ({ dashboard }) => {
    await dashboard.navigateTo('products')
  })

  test('TC-PROD-01 — La tabla de productos se carga correctamente', async ({ authenticatedPage }) => {
    const productsPage = new ProductsPage(authenticatedPage)
    // La tabla debe estar visible
    await expect(productsPage.productTable).toBeVisible({ timeout: 8_000 })
  })

  test('TC-PROD-02 — Crear un producto nuevo', async ({ authenticatedPage }) => {
    const productsPage = new ProductsPage(authenticatedPage)
    const nombre = `Cemento Portland TEST-${Date.now()}`

    await productsPage.openAddModal()
    await productsPage.fillProductForm({ nombre, unidad: 'bolsa', stockMinimo: 5 })
    await productsPage.submitModal()

    // El producto debe aparecer en la tabla (buscar por nombre para evitar paginación)
    await productsPage.searchProduct(nombre)
    await productsPage.expectProductInTable(nombre)
  })

  test('TC-PROD-03 — Buscar producto por nombre', async ({ authenticatedPage }) => {
    const productsPage = new ProductsPage(authenticatedPage)

    // Primero crear producto para asegurar que existe algo buscable
    const nombre = `Hierro 12mm TEST-${Date.now()}`
    await productsPage.openAddModal()
    await productsPage.fillProductForm({ nombre, unidad: 'unidad' })
    await productsPage.submitModal()

    // Buscar el producto
    await productsPage.searchProduct(nombre)
    await productsPage.expectProductInTable(nombre)
  })

  test('TC-PROD-04 — Búsqueda sin resultados no rompe la UI', async ({ authenticatedPage }) => {
    const productsPage = new ProductsPage(authenticatedPage)

    await productsPage.searchProduct('XYZ_PRODUCTO_INEXISTENTE_99999')

    // La tabla debe seguir visible (aunque vacía)
    await expect(productsPage.productTable).toBeVisible()
  })

  test('TC-PROD-05 — Nombre vacío no crea producto', async ({ authenticatedPage }) => {
    const productsPage = new ProductsPage(authenticatedPage)
    const countAntes = await productsPage.getProductCount()

    await productsPage.openAddModal()
    // No llenamos el nombre, intentamos submit
    const submitBtn = authenticatedPage.locator('[role="dialog"] button[type="submit"], [role="dialog"] button:has-text("Guardar")').first()
    await submitBtn.click()

    // El modal debe seguir abierto (validación client-side)
    await expect(productsPage.modal).toBeVisible({ timeout: 3_000 })

    const countDespues = await productsPage.getProductCount()
    expect(countDespues).toBe(countAntes)
  })

  test('TC-PROD-06 — Eliminar producto creado', async ({ authenticatedPage }) => {
    const productsPage = new ProductsPage(authenticatedPage)
    const nombre = `Producto ELIMINAR-${Date.now()}`

    // Crear el producto que vamos a eliminar
    await productsPage.openAddModal()
    await productsPage.fillProductForm({ nombre, unidad: 'unidad' })
    await productsPage.submitModal()

    // Buscar el producto para que sea la única fila visible
    await productsPage.searchProduct(nombre)
    await productsPage.expectProductInTable(nombre)

    await productsPage.deleteProduct(nombre)

    // Tras eliminar, el producto no debe aparecer
    await productsPage.expectProductNotInTable(nombre)
  })

})
