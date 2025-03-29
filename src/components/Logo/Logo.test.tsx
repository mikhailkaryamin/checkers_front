import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Logo } from './index';

describe('Logo', () => {
  it('renders logo correctly', () => {
    render(<Logo />);

    // Проверяем, что текст "ШАШКИ" отображается
    expect(screen.getByText('ШАШКИ')).toBeInTheDocument();

    // Проверяем, что SVG элемент отображается
    const svgElement = screen.getByTestId('svg-logo');
    expect(svgElement).toBeInTheDocument();
  });

  it('applies custom classnames when provided', () => {
    const customClasses = {
      logo: 'custom-logo',
      checker: 'custom-checker'
    };

    render(<Logo classnames={customClasses} />);

    const logoElement = screen.getByTestId('logo');
    expect(logoElement).toHaveClass('custom-logo');

    const checkerElement = document.querySelector('svg.custom-checker');
    expect(checkerElement).toBeInTheDocument();
  });
});
