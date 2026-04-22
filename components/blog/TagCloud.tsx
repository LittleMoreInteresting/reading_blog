"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface TagCloudProps {
  tags: {
    id: string;
    name: string;
    slug: string;
    _count?: { posts: number };
  }[];
}

export function TagCloud({ tags }: TagCloudProps) {
  if (tags.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <p>还没有标签呢 🏷️</p>
      </div>
    );
  }

  const maxCount = Math.max(...tags.map((t) => t._count?.posts || 1));

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {tags.map((tag, index) => {
        const count = tag._count?.posts || 0;
        const sizeScale = maxCount > 0 ? 0.75 + (count / maxCount) * 0.5 : 1;

        return (
          <motion.div
            key={tag.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/tags/${tag.slug}`}>
              <span
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors cursor-pointer"
                style={{ fontSize: `${sizeScale}rem` }}
              >
                <span className="text-amber-600">#</span>
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {tag.name}
                </span>
                <span className="text-xs text-gray-400">({count})</span>
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
