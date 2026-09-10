export type BlogCategory =
  | 'All categories'
  | 'Case Study'
  | 'Cost of Living'
  | 'Growth'
  | 'Legal'
  | 'Market Trends'
  | 'PG Ownership'
  | 'Property Management'
  | 'Property Tax'
  | 'Tech';

export interface BlogAuthor {
  name: string;
  avatar: string;
  role?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: Exclude<BlogCategory, 'All categories'>;
  excerpt: string;
  coverImage: string;
  author: BlogAuthor;
  publishDate: string; // e.g. "08 Sept 2024"
  readTime: string; // e.g. "6 min read"
  content: string; // Markdown or rich HTML content
  tags?: string[];
  featured?: boolean;
}
