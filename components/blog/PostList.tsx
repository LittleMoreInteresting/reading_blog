"use client";

import { PostCard } from "./PostCard";

interface PostListProps {
  posts: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    createdAt: string;
    views: number;
    tags: { id: string; name: string; slug: string }[];
  }[];
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <p>还没有文章呢 📖</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}
