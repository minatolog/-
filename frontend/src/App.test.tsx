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

  test('creates a presentation, adds slides, deletes it, and logs back in', async () => {
    const user = userEvent.setup();
    let store: unknown[] = [];
    const fetchMock = vi.fn(async (
      input: unknown,
      init?: { method?: string; body?: string }
    ) => {
      const url = String(input);

      if (url.endsWith('/admin/auth/register') || url.endsWith('/admin/auth/login')) {
        return {
          ok: true,
          json: async () => ({ token: 'test-token' }),
        };
      }

      if (url.endsWith('/store') && init?.method === 'GET') {
        return {
          ok: true,
          json: async () => ({ store }),
        };
      }

      if (url.endsWith('/store') && init?.method === 'PUT') {
        store = (JSON.parse(String(init.body)) as { store: unknown[] }).store;
        return {
          ok: true,
          json: async () => ({}),
        };
      }

      throw new Error(`Unexpected fetch call: ${url}`);
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
    await user.click(screen.getByRole('link', { name: /My First Presentation/i }));
    expect(await screen.findByText('Slide 1')).toBeTruthy();

    const addSlideButtons = screen.getAllByRole('button', { name: 'Add slide' });
    await user.click(addSlideButtons[0]);
    expect(await screen.findByText('Slide 2')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Slide 1' }));
    expect(screen.getByText('Slide 1')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Delete presentation' }));
    expect(await screen.findByText('Are you sure you want to delete this presentation?')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Yes' }));

    expect(await screen.findByText('No presentations yet.')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /logout/i }));
    expect(await screen.findByText('Welcome to Presto')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Login' }));
    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('No presentations yet.')).toBeTruthy();
    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(6);
  });
});
