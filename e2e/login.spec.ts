import { test, expect } from '@playwright/test';

test.describe('Login Page E2E', () => {
  test('should display validation errors for empty fields', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // Click submit without filling anything
    await page.getByRole('button', { name: /Acessar Portal/i }).click();

    // Verify zod validation errors appear
    await expect(page.getByText('E-mail inválido')).toBeVisible();
    await expect(page.getByText('A senha deve ter no mínimo 6 caracteres')).toBeVisible();
  });

  test('should successfully interact with login form', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    // Fill valid credentials
    await page.fill('input[type="email"]', 'teste@ecpelotas.com.br');
    await page.fill('input[type="password"]', '123456');

    // Mocks API call intercept
    await page.route('**/auth/login', async route => {
      const json = { accessToken: 'fake-token', user: { id: '1', email: 'teste@ecpelotas.com.br' } };
      await route.fulfill({ json });
    });

    await page.getByRole('button', { name: /Acessar Portal/i }).click();

    // After success, it should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
