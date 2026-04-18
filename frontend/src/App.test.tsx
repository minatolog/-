import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import App from './App.tsx';
import AuthProvider from './auth/AuthProvider.tsx';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test('renders landing page for unauthenticated users', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    expect(screen.getByText('Welcome to Presto')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Login' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Register' })).toBeTruthy();
  });

  test('registers and lands on dashboard', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'test-token' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ store: [] }),
      });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Register' }));

    await user.type(screen.getByLabelText(/Name/i), 'Test User');
    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    const passwordInputs = screen.getAllByLabelText(/Password/i);
    await user.type(passwordInputs[0], 'password123');
    await user.type(passwordInputs[1], 'password123');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('No presentations yet.')).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('creates a presentation and lands on the presentation page', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'test-token' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ store: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Register' }));
    await user.type(screen.getByLabelText(/Name/i), 'Test User');
    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    const passwordInputs = screen.getAllByLabelText(/Password/i);
    await user.type(passwordInputs[0], 'password123');
    await user.type(passwordInputs[1], 'password123');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await screen.findByText('No presentations yet.');
    await user.click(screen.getByRole('button', { name: 'New presentation' }));

    await user.clear(screen.getByLabelText('Title'));
    await user.type(screen.getByLabelText('Title'), 'My First Presentation');
    await user.type(screen.getByLabelText('Description'), 'Created in a test');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('My First Presentation')).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
