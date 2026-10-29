import { Page, Locator, expect } from '@playwright/test'

export interface ProductData {
  nombre: string
  categoria?: string
  descripcion?: string
  stock?: number
  stockMinimo?: number
  unidad?: string
}

export class ProductsPage {
  readonly page: Page
  readonly addButton: Locator
  readonly searchInput: Locator
  readonly productTable: Locator
  readonly modal: Locator

  constructor(page: Page) {
    this.page = page
    this.addButton = page.locator('button:has-text("Agregar Producto")').first()
    this.searchInput = page.locator('input[placeholder*="buscar" i], input[placeholder*="search" i], input[type="search"]').first()
    this.productTable = page.locator('table, [class*="table"], [class*="list"]').first()
    this.modal = page.locator('[role="dialog"], [class*="modal"], [class*="Modal"]').first()
  }

  async openAddModal() {
    await this.addButton.click()
    await expect(this.modal).toBeVisible({ timeout: 5_000 })
  }

  async fillProductForm(data: ProductData) {
    const nombreInput = this.modal.locator('#prod-name').first()
    await nombreInput.fill(data.nombre)

    if (data.descripcion) {
      const descInput = this.modal.locator('textarea, input[name="descripcion"]').first()
      if (await descInput.count() > 0) await descInput.fill(data.descripcion)
    }

    if (data.unidad) {
      const unidadInput = this.modal.locator('#prod-unit').first()
      if (await unidadInput.count() > 0) await unidadInput.fill(data.unidad)
    }

    if (data.stockMinimo !== undefined) {
      const minInput = this.modal.locator('input[name*="minimo" i], input[name*="min" i], input[placeholder*="mínimo" i]').first()
      if (await minInput.count() > 0) await minInput.fill(String(data.stockMinimo))
    }
  }

  async submitModal() {
    const submitBtn = this.modal.locator('button[type="submit"], button:has-text("Guardar"), button:has-text("Crear")').first()
    await submitBtn.click()
    await expect(this.modal).toBeHidden({ timeout: 8_000 })
  }

  async searchProduct(name: string) {
    await this.searchInput.fill(name)
    await this.page.waitForTimeout(500)
  }

  async expectProductInTable(name: string) {
    await expect(this.page.locator(`text="${name}"`).first()).toBeVisible({ timeout: 8_000 })
  }

  async expectProductNotInTable(name: string) {
    await expect(this.page.locator(`text="${name}"`).first()).toBeHidden({ timeout: 5_000 })
  }

  async getProductCount(): Promise<number> {
    return await this.page.locator('table tbody tr').count()
  }

  async deleteProduct(name: string) {
    const row = this.page.locator(`tr:has-text("${name}")`).first()
    await row.click()
    const deleteBtn = row.locator('button.bc-pt-del-btn').first()
    await deleteBtn.click()
    // Custom confirm modal (useConfirm hook) — click the ok button
    const confirmBtn = this.page.locator('button.confirm-btn-ok').first()
    await confirmBtn.click({ timeout: 5_000 })
  }
}
