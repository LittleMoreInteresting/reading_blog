"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Eye } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    createdAt: string;
    views: number;
    tags: { id: string; name: string; slug: string }[];
  };
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link href={`/posts/${post.slug}`}>
        <article className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
          {post.coverImage ? (
            <div className="h-40 bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div className="h-24 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30" />
          )}

          <div className="p-5">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors mb-2">
              {post.title}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
              {post.excerpt || "暂无摘要"}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.createdAt}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.views}
                </span>
              </div>

              <div className="flex gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
