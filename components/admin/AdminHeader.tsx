"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const breadcrumbMap: Record<string, string> = {
  "/admin": "仪表盘",
  "/admin/posts": "文章管理",
  "/admin/posts/new": "写文章",
};

export function AdminHeader({ user }: { user: any }) {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const parts = pathname?.split("/").filter(Boolean) || [];
    const crumbs = [{ label: "后台", href: "/admin" }];

    if (parts.includes("posts")) {
      crumbs.push({ label: "文章管理", href: "/admin/posts" });
    }
    if (parts.includes("new")) {
      crumbs.push({ label: "写文章", href: "/admin/posts/new" });
    }
    if (parts.includes("edit")) {
      crumbs.push({ label: "编辑文章", href: pathname || "" });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
      <nav className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            <span
              className={
                index === breadcrumbs.length - 1
                  ? "font-medium text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }
            >
              {crumb.label}
            </span>
          </div>
        ))}
      </nav>
    </header>
  );
}
