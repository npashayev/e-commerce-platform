type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiFetchOptions<B> {
  method?: HttpMethod;
  body?: B;
  cache?: RequestCache; // optional fetch cache
  revalidate?: number; // optional ISR revalidate in seconds (for server fetch)
  headers?: HeadersInit;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function apiFetch<T, B extends Record<string, unknown> | undefined = undefined>(
  endpoint: string,
  options: ApiFetchOptions<B> = {},
): Promise<T> {
  const { method = 'GET', body, cache = 'no-store', revalidate, headers } = options;

  const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
    cache,
  };

  // Add Next.js ISR option if defined
  if (revalidate !== undefined) {
    fetchOptions.next = { revalidate };
  }

  // Use relative URL — works both server-side and client-side
  const res = await fetch(`${baseUrl}/api${endpoint}`, fetchOptions);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API fetch failed: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json() as Promise<T>;
}
