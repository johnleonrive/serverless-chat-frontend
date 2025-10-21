import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageInput from '../MessageInput';
import { useChatStore } from '@/lib/store';

// Mock the store
vi.mock('@/lib/store', () => ({
  useChatStore: vi.fn(),
}));

describe('MessageInput', () => {
  it('should submit and clear message', async () => {
    const sendMessage = vi.fn();
    const mockStore = {
      sendMessage,
      connectionStatus: 'connected' as const,
    };

    vi.mocked(useChatStore).mockReturnValue(mockStore as never);

    render(<MessageInput />);

    const input = screen.getByPlaceholderText(/type your message/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    // Type a message
    await userEvent.type(input, 'Hello, world!');
    expect(input).toHaveValue('Hello, world!');

    // Submit
    await userEvent.click(submitButton);

    expect(sendMessage).toHaveBeenCalledWith('Hello, world!');
    expect(input).toHaveValue('');
  });

  it('should disable input when not connected', () => {
    const mockStore = {
      sendMessage: vi.fn(),
      connectionStatus: 'connecting' as const,
    };

    vi.mocked(useChatStore).mockReturnValue(mockStore as never);

    render(<MessageInput />);

    const input = screen.getByPlaceholderText(/connecting/i);
    expect(input).toBeDisabled();
  });
});
