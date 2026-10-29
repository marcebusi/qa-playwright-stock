import { Page, Locator, expect } from '@playwright/test'

export interface EntradaData {
  producto: string
  cantidad: number
  proveedor?: string
  observaciones?: string
}

export class EntriesPage {
  readonly page: Page
  readonly addButton: Locator
  readonly modal: Locator
  readonly table: Locator

  constructor(page: Page) {
    this.page = page
    this.addButton = page.locator('button:has-text("Nueva Entrada")').first()
    this.modal = page.locator('[role="dialog"], [class*="modal"], [class*="Modal"]').first()
    this.table = page.locator('table').first()
  }

  async openAddModal() {
    await this.addButton.click()
    await expect(this.modal).toBeVisible({ timeout: 5_000 })
  }

  async fillEntradaForm(data: EntradaData) {
    // Seleccionar producto (puede ser select o autocomplete)
    const productoInput = this.modal.locator('select[name*="producto" i], input[placeholder*="producto" i]').first()
    if (await productoInput.getAttribute('tagName') === 'SELECT' || await productoInput.evaluate(el => el.tagName) === 'SELECT') {
      await productoInput.selectOption({ label: data.producto })
    } else {
      await productoInput.fill(data.producto)
      const option = this.page.locator(`[role="option"]:has-text("${data.producto}"), li:has-text("${data.producto}")`).first()
      if (await option.isVisible({ timeout: 2_000 }).catch(() => false)) await option.click()
    }

    // Cantidad
    const cantidadInput = this.modal.locator('input[name*="cantidad" i], input[type="number"]').first()
    await cantidadInput.fill(String(data.cantidad))

    // Proveedor (opcional)
    if (data.proveedor) {
      const provInput = this.modal.locator('input[name*="proveedor" i], select[name*="proveedor" i]').first()
      if (await provInput.count() > 0) await provInput.fill(data.proveedor)
    }

    // Observaciones (opcional)
    if (data.observaciones) {
      const obsInput = this.modal.locator('textarea, input[name*="observacion" i]').first()
      if (await obsInput.count() > 0) await obsInput.fill(data.observaciones)
    }
  }

  async submitModal() {
    const submitBtn = this.modal.locator('button[type="submit"], button:has-text("Guardar"), button:has-text("Registrar")').first()
    await submitBtn.click()
    await expect(this.modal).toBeHidden({ timeout: 8_000 })
  }

  async getLastEntradaRow() {
    const rows = this.table.locator('tbody tr')
    const count = await rows.count()
    return rows.nth(count - 1)
  }

  async expectSuccessToast() {
    const toast = this.page.locator('[class*="toast"], [class*="success"], [role="status"]').first()
    await expect(toast).toBeVisible({ timeout: 6_000 })
  }
}
