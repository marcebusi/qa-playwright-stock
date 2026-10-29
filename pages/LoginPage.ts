import { Page, Locator, expect } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i], input[placeholder*="usuario" i]').first()
    this.passwordInput = page.locator('input[type="password"]').first()
    this.submitButton = page.locator('button[type="submit"], button:has-text("Ingresar"), button:has-text("Iniciar")').first()
    this.errorMessage = page.locator('.error, [class*="error"], [class*="alert"], [role="alert"]').first()
  }

  async goto() {
    await this.page.goto('/login')
    await this.page.waitForLoadState('networkidle')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async loginAsAdmin() {
    await this.goto()
    await this.login(
      process.env.TEST_ADMIN_EMAIL ?? 'admin@stockobra.com',
      process.env.TEST_ADMIN_PASSWORD ?? 'admin123'
    )
  }

  async waitForDashboard() {
    await this.page.waitForURL(/\/dashboard|\/home|\/products/, { timeout: 10_000 })
  }

  async expectError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5_000 })
  }
}
