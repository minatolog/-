import type {PresentationType} from "./user/PresentaionType.ts";

const BACKEND_URL = 'http://localhost:5005';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean; // 是否需要带 token
};

type LoginResponse = {
  token: string;
};

type RegisterResponse = {
  token: string;
}

type Store = {
  store: PresentationType[];
}


async function request(path: string, options: RequestOptions = {}) {
  const { method = 'GET', body, auth = false } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
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

  return data;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return request('/admin/auth/login', {
    method: 'POST',
    body: {email, password}
  });
}

export function register(email: string, password: string, name: string): Promise<RegisterResponse> {
  return request('/admin/auth/register', {
    method: 'POST',
    body: {email, password, name}
  });
}

export async function getPresentationList(): Promise<PresentationType[]> {
  const storeObject: Store = await request('/store', {
    method: 'GET',
    auth: true,
  });

  if (!Array.isArray(storeObject.store)) {
    return [];
  }

  return storeObject.store;
}

export function UpdatePresentationList(presentationList: PresentationType[]) {
  const storeBody: Store = {store: presentationList}
  return request('/store', {
    method: 'PUT',
    auth: true,
    body: storeBody,
  })
}