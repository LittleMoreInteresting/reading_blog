"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      setDark(false);
    } else {
      html.classList.add("dark");
      setDark(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={dark ? "切换到亮色模式" : "切换到暗色模式"}
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
