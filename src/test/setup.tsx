import '@testing-library/jest-dom';

// Мок для SVG
vi.mock('*.svg?react', () => ({
  default: () => <svg data-testid="mocked-svg" />
}));

// Мок для SCSS модулей
vi.mock('*.module.scss', () => {
  return {
    default: new Proxy(
      {},
      {
        get: (_, prop) => prop
      }
    )
  };
});
