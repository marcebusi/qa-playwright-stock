import { Page, Locator, expect } from '@playwright/test'

export type Tab = 'home' | 'products' | 'entries' | 'exits' | 'personal' | 'projects' | 'costs' | 'analytics' | 'critical' | 'users'

const TAB_SLUGS: Record<Tab, string> = {
  home: 'dashboard',
  products: 'products',
  entries: 'entries',
  exits: 'exits',
  personal: 'personal',
  projects: 'projects',
  costs: 'costs',
  analytics: 'analytics',
  critical: 'critical',
  users: 'users',
}

export class DashboardPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(tab: Tab = 'home') {
    const slug = process.env.EMPRESA_SLUG ?? 'stockobra'
    await this.page.goto(`/${slug}/${TAB_SLUGS[tab]}`)
    await this.page.waitForLoadState('networkidle')
  }

  async navigateTo(tab: Tab) {
    const slug = process.env.EMPRESA_SLUG ?? 'stockobra'
    // Intentar click en nav primero
    const navItem = this.page.locator(`[data-tab="${tab}"], nav a[href*="${TAB_SLUGS[tab]}"], button:has-text("${this.tabLabel(tab)}")`)
    if (await navItem.count() > 0) {
      await navItem.first().click()
    } else {
      await this.page.goto(`/${slug}/${TAB_SLUGS[tab]}`)
    }
    await this.page.waitForLoadState('networkidle')
  }

  private tabLabel(tab: Tab): string {
    const labels: Record<Tab, string> = {
      home: 'Inicio', products: 'Productos', entries: 'Entradas', exits: 'Salidas',
      personal: 'Personal', projects: 'Obras', costs: 'Costos', analytics: 'Analíticas',
      critical: 'Stock Crítico', users: 'Usuarios',
    }
    return labels[tab]
  }

  async expectTabVisible(tab: Tab) {
    const slug = TAB_SLUGS[tab]
    await expect(this.page).toHaveURL(new RegExp(slug), { timeout: 8_000 })
  }

  async logout() {
    // Abrir menú de usuario (avatar en top-right)
    const avatarBtn = this.page.locator('.um-avatar-trigger').first()
    await avatarBtn.click()
    // Clicar "Cerrar sesión" en el dropdown
    const logoutBtn = this.page.locator('button:has-text("Cerrar sesión"), button.um-row--danger').first()
    await logoutBtn.click()
    await this.page.waitForURL('/login', { timeout: 8_000 })
  }

  async getUserName(): Promise<string> {
    const userEl = this.page.locator('[class*="user-name"], [class*="username"], [class*="avatar"]').first()
    return await userEl.textContent() ?? ''
  }
}
