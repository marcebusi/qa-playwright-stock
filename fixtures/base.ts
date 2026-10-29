import { test as base, Page } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'

type AuthFixtures = {
  authenticatedPage: Page
  dashboard: DashboardPage
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.loginAsAdmin()
    await loginPage.waitForDashboard()
    await use(page)
  },

  dashboard: async ({ authenticatedPage }, use) => {
    await use(new DashboardPage(authenticatedPage))
  },
})

export { expect } from '@playwright/test'
