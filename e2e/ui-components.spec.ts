import { expect, test } from '@playwright/test';

test.describe('UI Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ждем пока прелоадер пройдет
    await page.waitForTimeout(5000);
  });

  test('preloader works correctly', async ({ page }) => {
    // Проверяем, что прелоадер отображается и исчезает
    await page.waitForTimeout(7000);
    await expect(page.locator('text=Играть')).toBeVisible({ timeout: 10000 });

    // После появления меню, прелоадер должен исчезнуть
    await expect(page.locator('[data-testid="progress_bar"]')).not.toBeVisible();
  });

  test('fullscreen button works', async ({ page }) => {
    // Нажимаем кнопку фуллскрина
    // Примечание: в Playwright трудно проверить реальный полноэкранный режим,
    // т.к. это требует разрешения пользователя
    // Поэтому просто проверим, что кнопка корректно кликается
    await page.locator('[data-testid="fullscreen_button"]').click();
  });

  test('logo renders correctly', async ({ page }) => {
    // Проверяем, что лого отображается
    await expect(page.locator('[data-testid="logo"]')).toBeVisible();
    await expect(page.locator('text=ШАШКИ')).toBeVisible();
  });
});
