"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
    },
    [query, router]
  );

  return (
    <div className="relative">
      {isOpen ? (
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章..."
            autoFocus
            className="w-40 md:w-56 h-8 px-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="p-1.5 text-gray-500 hover:text-amber-600 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-500 hover:text-amber-600 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
