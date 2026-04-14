const BACKEND_URL = 'http://localhost:5005';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
};

export type AuthResponse = {
  token: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response: Response = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data as T;
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/admin/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function register(email: string, password: string, name: string): Promise<AuthResponse> {
  return request<AuthResponse>('/admin/auth/register', {
    method: 'POST',
    body: { email, password, name },
  });
}
