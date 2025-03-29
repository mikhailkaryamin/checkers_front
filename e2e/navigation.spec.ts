import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ждем пока прелоадер пройдет
    await page.waitForTimeout(5000);
    await page.waitForSelector('text=Играть', { timeout: 10000 });
  });

  test('navigates from main menu to game and back', async ({ page }) => {
    // Переходим на экран игры
    await page.click('text=Играть');

    // Проверяем, что панель настроек отображается
    await expect(page.locator('[data-testid="setting_panel"]')).toBeVisible();

    // Возвращаемся на главный экран
    await page.locator('[data-testid="back_button"]').click();
    await page.waitForTimeout(3000);
    // Проверяем, что вернулись в главное меню
    await expect(page.locator('text=Играть')).toBeVisible();
  });

  test('navigates to theory screen and back', async ({ page }) => {
    // Переходим на экран теории
    await page.click('text=Теория');

    // Проверяем, что контент теории отображается
    await expect(page.locator('[data-testid="theory_book"]')).toBeVisible();

    // Возвращаемся на главный экран
    await page.locator('[data-testid="back_button"]').click();
    await page.waitForTimeout(3000);

    // Проверяем, что вернулись в главное меню
    await expect(page.locator('text=Теория')).toBeVisible();
  });

  test('navigates to statistics screen and back', async ({ page }) => {
    // Переходим на экран статистики
    await page.click('text=Статистика');

    // Проверяем, что контент статистики отображается
    await expect(page.locator('[data-testid="statistics"]')).toBeVisible();

    // Возвращаемся на главный экран
    await page.locator('[data-testid="back_button"]').click();
    await page.waitForTimeout(3000);

    // Проверяем, что вернулись в главное меню
    await expect(page.locator('text=Статистика')).toBeVisible();
  });
});
