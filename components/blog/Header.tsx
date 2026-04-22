"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";
import { SearchBox } from "./SearchBox";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">
          <BookOpen className="w-5 h-5 text-amber-600" />
          读书笔记小铺
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
          <Link href="/" className="hover:text-amber-600 transition-colors">首页</Link>
          <Link href="/tags" className="hover:text-amber-600 transition-colors">标签</Link>
          <Link href="/about" className="hover:text-amber-600 transition-colors">关于</Link>
        </nav>

        <div className="flex items-center gap-3">
          <SearchBox />
        </div>
      </div>
    </motion.header>
  );
}
