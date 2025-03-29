import { ChessSkinType } from 'src/components/Battle/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Timer } from './index';

describe('Timer', () => {
  let timer: Timer;

  // Мокаем setTimeout и clearTimeout
  beforeEach(() => {
    vi.useFakeTimers();

    timer = new Timer({
      data: {
        mainTime: 60000, // 1 минута
        extraTime: 5000, // 5 секунд
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with correct data', () => {
    expect(timer.value).toBe(60000);
    expect(timer.time).toBe('01:00');
    expect(timer.minutes).toBe(1);
    expect(timer.seconds).toBe(0);
    expect(timer.extraTimer.value).toBe(5000);
    expect(timer.extraTimer.second).toBe(5);
  });

  it('sets skin type correctly', () => {
    timer.setSkinType(ChessSkinType.Type1);
    expect(timer.skinType).toBe(ChessSkinType.Type1);
  });

  it('can be paused', () => {
    timer.run();
    expect(timer.isLaunched).toBe(true);

    // Ставим на паузу
    timer.pause();

    // Перематываем время - ничего не должно измениться
    vi.advanceTimersByTime(1000);
    expect(timer.value).toBe(60000);
  });
});
