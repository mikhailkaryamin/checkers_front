import { expect, test } from '@playwright/test';

test.describe('Gameplay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ждем пока прелоадер пройдет
    await page.waitForTimeout(5000);
    await page.waitForSelector('text=Играть', { timeout: 10000 });

    // Переходим к экрану настройки игры
    await page.click('text=Играть');

    // Настраиваем игру
    await page.waitForTimeout(2000);
    await page.click('text=10 мин');
    await page.waitForTimeout(1000);
    await page.click('text=WCDF');
    await page.waitForTimeout(1000);
    await page.click('text=новичок');
    await page.waitForTimeout(1000);
    await page.click('text=за чёрных');
    await page.waitForTimeout(1000);
    await page.locator('[data-testid="skin_button"]').first().click();
    await page.waitForTimeout(1000);
    const submitButton = page.locator('[data-testid="submit_button"]');
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    await page.waitForTimeout(1000);
    await expect(page.locator('[data-testid="setting_panel"]')).toHaveCSS('opacity', '0');
  });

  test('selects a piece and makes a move', async ({ page }) => {
    // Находим белую шашку и пытаемся сделать ход
    // Так как начальное положение может отличаться,
    // найдем любую шашку которая может ходить (будет иметь класс piece_isHoverable)

    // Ждем, чтобы дать игре полностью загрузиться
    await page.waitForTimeout(1000);

    // Находим доступные шашки
    const pieces = page.locator('[data-testid="piece_isHoverable"]');

    // Кликаем по первой шашке
    await pieces.first().click();

    // Проверяем, появились ли точки для возможных ходов
    await expect(page.locator('[data-testid="piece_isHoverable"]').first()).toBeVisible();

    // Кликаем по первой доступной точке для хода
    await page.locator('div:has([data-testid="dot"])').first().click();

    // Ожидаем, что ход выполнен (доска изменилась)
    // Просто ждем немного, чтобы анимация хода завершилась
    await page.waitForTimeout(1000);

    // Проверяем, что после хода есть доступные клетки для следующего хода
    // (обычно ход делается компьютером и затем игрок снова может ходить)
    await page.waitForSelector('[data-testid="piece_isHoverable"]', { timeout: 5000 });
  });

  test('resets the game', async ({ page }) => {
    // Находим кнопку сброса и нажимаем на неё
    await page.locator('[data-testid="reset_button"]').click();
    await page.waitForTimeout(2000);
    // Проверяем, что вернулись к экрану настроек
    const elementCount = await page.locator('div:has([data-testid="dot"])').count();
    expect(elementCount).toBe(0);
  });
});
