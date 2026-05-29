const API_BASE_URL = 'https://infov-08oy.onrender.com/api/v1';

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options, // ← أولاً: انتشر options
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers, // ← ثم ادمج headers مع أي headers إضافية
    },
  });
  
  const data = await res.json();
  
  if (!data.success) {
    throw new Error(data.error?.message || 'Request failed');
  }
  
  return data.data;
}
