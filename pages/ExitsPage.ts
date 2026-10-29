import { Page, Locator, expect } from '@playwright/test'

export interface SalidaData {
  producto: string
  cantidad: number
  obra?: string
  observaciones?: string
}

export class ExitsPage {
  readonly page: Page
  readonly addButton: Locator
  readonly modal: Locator
  readonly table: Locator

  constructor(page: Page) {
    this.page = page
    this.addButton = page.locator('button:has-text("Nueva Salida")').first()
    this.modal = page.locator('[role="dialog"], [class*="modal"], [class*="Modal"]').first()
    this.table = page.locator('table').first()
  }

  async openAddModal() {
    await this.addButton.click()
    await expect(this.modal).toBeVisible({ timeout: 5_000 })
  }

  async fillSalidaForm(data: SalidaData) {
    // Seleccionar producto
    const productoInput = this.modal.locator('select[name*="producto" i], input[placeholder*="producto" i]').first()
    const tagName = await productoInput.evaluate(el => el.tagName).catch(() => 'INPUT')
    if (tagName === 'SELECT') {
      await productoInput.selectOption({ label: data.producto })
    } else {
      await productoInput.fill(data.producto)
      const option = this.page.locator(`[role="option"]:has-text("${data.producto}"), li:has-text("${data.producto}")`).first()
      if (await option.isVisible({ timeout: 2_000 }).catch(() => false)) await option.click()
    }

    // Cantidad
    const cantidadInput = this.modal.locator('input[name*="cantidad" i], input[type="number"]').first()
    await cantidadInput.fill(String(data.cantidad))

    // Obra destino (opcional)
    if (data.obra) {
      const obraInput = this.modal.locator('select[name*="obra" i], input[placeholder*="obra" i]').first()
      if (await obraInput.count() > 0) {
        const tagName = await obraInput.evaluate(el => el.tagName)
        if (tagName === 'SELECT') {
          await obraInput.selectOption({ label: data.obra })
        } else {
          await obraInput.fill(data.obra)
        }
      }
    }

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

  async expectSuccessToast() {
    const toast = this.page.locator('[class*="toast"], [class*="success"], [role="status"]').first()
    await expect(toast).toBeVisible({ timeout: 6_000 })
  }

  async getRowCount(): Promise<number> {
    return await this.table.locator('tbody tr').count()
  }
}
