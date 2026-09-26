import { API_BASE } from '../config/api';

export interface PublicBlogItem {
  id: string;
  title: string;
  slug: string;
  contentHtml?: string;
  excerpt?: string;
  coverImageUrl?: string;
  authorName?: string;
  category: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  publishedAt?: string;
  readTimeMinutes?: number;
  viewsCount?: number;
  createdAt?: string;
}

export interface BlogCategoryCount {
  category: string;
  count: number;
}

export interface BlogListApiResponse {
  success: boolean;
  data: PublicBlogItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore?: boolean;
  };
}

export const blogApi = {
  getBlogs: async (params?: {
    search?: string;
    category?: string;
    tag?: string;
    sortBy?: 'newest' | 'popular' | 'oldest';
    page?: number;
    limit?: number;
  }): Promise<BlogListApiResponse> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category && params.category !== 'All categories') {
      query.append('category', params.category);
    }
    if (params?.tag) query.append('tag', params.tag);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/public/blogs?${query.toString()}`);
    if (!res.ok) throw new Error(`Blog query error: ${res.status}`);
    return res.json();
  },

  getBlogBySlug: async (slugOrId: string): Promise<{ success: boolean; data: PublicBlogItem }> => {
    const res = await fetch(`${API_BASE}/public/blogs/${encodeURIComponent(slugOrId)}`);
    if (!res.ok) throw new Error(`Blog article not found: ${res.status}`);
    return res.json();
  },

  getCategories: async (): Promise<{ success: boolean; data: BlogCategoryCount[] }> => {
    const res = await fetch(`${API_BASE}/public/blogs/categories`);
    if (!res.ok) throw new Error(`Categories error: ${res.status}`);
    return res.json();
  },

  getRecentBlogs: async (limit: number = 4): Promise<{ success: boolean; data: PublicBlogItem[] }> => {
    const res = await fetch(`${API_BASE}/public/blogs/recent?limit=${limit}`);
    if (!res.ok) throw new Error(`Recent blogs error: ${res.status}`);
    return res.json();
  },
};
