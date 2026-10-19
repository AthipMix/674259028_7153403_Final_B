const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const NEWS_URL = BASE_URL.endsWith("/api/news")
  ? BASE_URL
  : `${BASE_URL}/api/news`;

async function request(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("ไม่สามารถเชื่อมต่อ Backend ได้ กรุณาตรวจสอบเซิร์ฟเวอร์");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || `เกิดข้อผิดพลาด HTTP ${response.status}`,
    );
  }

  return data;
}

export async function getAllNews({ search = "", category = "" } = {}) {
  const params = new URLSearchParams();

  if (search.trim()) params.set("search", search.trim());
  if (category) params.set("category", category);

  const query = params.toString();

  return request(`${NEWS_URL}${query ? `?${query}` : ""}`);
}

export function getNewsById(id) {
  return request(`${NEWS_URL}/${id}`);
}

export function createNews(news) {
  return request(NEWS_URL, {
    method: "POST",
    body: JSON.stringify(news),
  });
}

export function updateNews(id, news) {
  return request(`${NEWS_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(news),
  });
}

export function deleteNews(id) {
  return request(`${NEWS_URL}/${id}`, {
    method: "DELETE",
  });
}
