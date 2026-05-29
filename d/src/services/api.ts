const API_BASE_URL = 'https://infov-08oy.onrender.com/api/v1'; // ← تأكد من الرابط

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      headers: { 
        'Content-Type': 'application/json',
        // أضف هذا إذا Render يحتاجه:
        'Accept': 'application/json'
      },
      ...options,
    });
    
    // ✅ تحقق من حالة الـ response أولاً
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Request failed');
    }
    
    return data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error; // أعد رميها ليتم عرضها في الواجهة
  }
}
