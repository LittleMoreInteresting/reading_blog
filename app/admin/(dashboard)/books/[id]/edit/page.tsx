"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const PRESET_COLORS = [
  { cover: "#FFD93D", spine: "#F59E0B", name: "暖黄" },
  { cover: "#A78BFA", spine: "#8B5CF6", name: "紫罗兰" },
  { cover: "#60A5FA", spine: "#3B82F6", name: "天蓝" },
  { cover: "#34D399", spine: "#10B981", name: "翠绿" },
  { cover: "#F472B6", spine: "#EC4899", name: "粉红" },
  { cover: "#FB923C", spine: "#F97316", name: "橙色" },
  { cover: "#F87171", spine: "#EF4444", name: "红色" },
  { cover: "#94A3B8", spine: "#64748B", name: "灰色" },
  { cover: "#22D3EE", spine: "#06B6D4", name: "青色" },
  { cover: "#475569", spine: "#334155", name: "深蓝灰" },
];

const PRESET_EMOJIS = ["📚", "🌹", "📮", "🌌", "🦋", "🌲", "🌙", "🌾", "🏰", "🏮", "🌑", "🪁", "💌", "☀️", "🗡️", "🏔️", "🐦", "💎", "🕯️", "🎣", "🌍"];

interface BookData {
  id: string;
  title: string;
  author: string;
  slug: string;
  description: string;
  coverColor: string;
  spineColor: string;
  emoji: string;
}

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [book, setBook] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [bookId, setBookId] = useState("");

  useEffect(() => {
    let cancelled = false;
    params.then(async ({ id }) => {
      setBookId(id);
      try {
        const res = await fetch(`/api/books`);
        if (!res.ok) throw new Error("获取书籍失败");
        const books: BookData[] = await res.json();
        const found = books.find((b) => b.id === id);
        if (!found) {
          throw new Error("书籍不存在");
        }
        if (!cancelled) setBook(found);
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [params]);

  const handleSave = async () => {
    if (!book) return;
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/books/${book.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: book.title,
          author: book.author,
          description: book.description,
          coverColor: book.coverColor,
          spineColor: book.spineColor,
          emoji: book.emoji,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "保存失败");
      }

      router.push("/admin/books");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="text-center py-20 text-red-600">
        {error}
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/books")}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          编辑书籍
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">书名</Label>
          <Input
            id="title"
            value={book.title}
            onChange={(e) => setBook({ ...book, title: e.target.value })}
            placeholder="输入书名"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="author">作者</Label>
          <Input
            id="author"
            value={book.author}
            onChange={(e) => setBook({ ...book, author: e.target.value })}
            placeholder="输入作者名"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug（只读）</Label>
          <Input
            id="slug"
            value={book.slug}
            disabled
            className="mt-1 bg-gray-100 dark:bg-gray-800"
          />
        </div>

        <div>
          <Label htmlFor="description">描述</Label>
          <Textarea
            id="description"
            value={book.description}
            onChange={(e) => setBook({ ...book, description: e.target.value })}
            placeholder="书籍简介"
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label>封面颜色</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => {
                  setBook({ ...book, coverColor: color.cover, spineColor: color.spine });
                }}
                className={`w-10 h-10 rounded-lg shadow-sm border-2 transition-all ${
                  book.coverColor === color.cover
                    ? "border-amber-500 scale-110"
                    : "border-transparent hover:scale-105"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${color.cover} 0%, ${color.spine} 100%)`,
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div>
          <Label>图标</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {PRESET_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setBook({ ...book, emoji: e })}
                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border-2 transition-all ${
                  book.emoji === e
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* 预览 */}
        <div>
          <Label>预览</Label>
          <div className="mt-2 flex justify-center py-4">
            <div
              className="w-32 h-44 rounded-r-xl rounded-l-sm shadow-lg flex flex-col items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${book.coverColor} 0%, ${book.spineColor} 100%)`,
                boxShadow:
                  "4px 6px 0px rgba(74,55,40,0.2), inset -8px 0 20px rgba(0,0,0,0.1)",
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-3"
                style={{
                  background: `linear-gradient(to right, ${book.spineColor}, ${book.coverColor})`,
                }}
              />
              <div className="text-4xl mb-2">{book.emoji}</div>
              <div className="text-white font-bold text-sm text-center px-3 leading-tight">
                {book.title || "书名"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t">
        <Button
          onClick={handleSave}
          disabled={saving || !book.title}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Save className="w-4 h-4 mr-2" />
          保存
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push("/admin/books")}
          disabled={saving}
        >
          取消
        </Button>
      </div>
    </div>
  );
}
