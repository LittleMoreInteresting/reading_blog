export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  views: number;
  tags: Tag[];
  author?: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  slug: string;
  coverColor: string;
  spineColor: string;
  emoji: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
}
