"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PenLine,
  LogOut,
  BookOpen,
  Library,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/books", label: "书籍管理", icon: Library },
  { href: "/admin/posts", label: "文章管理", icon: FileText },
  { href: "/admin/posts/new", label: "写文章", icon: PenLine },
];

export function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/admin" className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <BookOpen className="w-6 h-6 text-amber-600" />
          读书笔记后台
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-3 px-4 py-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.name || user.email}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      </div>
    </aside>
  );
}
