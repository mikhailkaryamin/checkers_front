import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BackButton } from './index';

// Мокаем IconButton компонент
vi.mock('src/components/IconButton', () => ({
  IconButton: ({ onClick, ...props }: any) => (
    <button data-testid="back_button" onClick={onClick} {...props}>
      Back Button
    </button>
  ),
}));

describe('BackButton', () => {
  it('renders correctly', () => {
    render(<BackButton onClick={() => {}} />);
    expect(screen.getByTestId('back_button')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<BackButton onClick={handleClick} />);

    fireEvent.click(screen.getByTestId('back_button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
