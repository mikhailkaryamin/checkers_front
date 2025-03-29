import { expect, test } from '@playwright/test';

test.describe('Game Setup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ждем пока прелоадер пройдет
    await page.waitForTimeout(5000);
    await page.waitForSelector('text=Играть', { timeout: 10000 });

    // Переходим к экрану настройки игры
    await page.click('text=Играть');
  });

  test('selects game options and starts the game', async ({ page }) => {
    await page.waitForTimeout(2000);
    // Выбираем таймер
    await page.click('text=10 мин');
    await page.waitForTimeout(1000);

    // Выбираем правила
    await page.click('text=WCDF');
    await page.waitForTimeout(1000);

    // Выбираем сложность
    await page.click('text=новичок');
    await page.waitForTimeout(1000);

    // Выбираем сторону
    await page.click('text=за чёрных');
    await page.waitForTimeout(1000);

    // Выбираем стиль
    await page.locator('[data-testid="skin_button"]').first().click();
    await page.waitForTimeout(1000);

    // Проверяем, что кнопка подтверждения активна
    const submitButton = page.locator('[data-testid="submit_button"]');
    await expect(submitButton).toBeVisible();

    // Нажимаем кнопку подтверждения
    await submitButton.click();
    await page.waitForTimeout(1000);
    // Проверяем, что игра началась (доска видна)
    await expect(page.locator('[data-testid="setting_panel"]')).toHaveCSS('opacity', '0');
  });
});
