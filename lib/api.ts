const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `API error: ${res.status}`);
  }

  return res.json();
}

export const api = {
  posts: {
    list: (params?: { page?: number; limit?: number; search?: string; tag?: string; published?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      if (params?.search) query.set("search", params.search);
      if (params?.tag) query.set("tag", params.tag);
      if (params?.published !== undefined) query.set("published", String(params.published));
      return fetchAPI<{ posts: any[]; pagination: any }>(`/api/posts?${query.toString()}`);
    },
    get: (slug: string) => fetchAPI<any>(`/api/posts/${slug}`),
    create: (data: any) => fetchAPI<any>("/api/posts", { method: "POST", body: JSON.stringify(data) }),
    update: (slug: string, data: any) => fetchAPI<any>(`/api/posts/${slug}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (slug: string) => fetchAPI<any>(`/api/posts/${slug}`, { method: "DELETE" }),
  },
  tags: {
    list: () => fetchAPI<any[]>("/api/tags"),
    create: (data: { name: string; slug: string }) => fetchAPI<any>("/api/tags", { method: "POST", body: JSON.stringify(data) }),
  },
  search: {
    query: (q: string) => fetchAPI<{ posts: any[]; query: string }>(`/api/search?q=${encodeURIComponent(q)}`),
  },
  books: {
    list: () => fetchAPI<any[]>("/api/books"),
    create: (data: any) => fetchAPI<any>("/api/books", { method: "POST", body: JSON.stringify(data) }),
  },
};
