"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
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

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewBookPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverColor, setCoverColor] = useState(PRESET_COLORS[0].cover);
  const [spineColor, setSpineColor] = useState(PRESET_COLORS[0].spine);
  const [emoji, setEmoji] = useState(PRESET_EMOJIS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          slug,
          description,
          coverColor,
          spineColor,
          emoji,
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

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        添加书籍
      </h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">书名 *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="输入书名"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="author">作者</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="输入作者名"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="url-friendly-slug"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">描述</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
                  setCoverColor(color.cover);
                  setSpineColor(color.spine);
                }}
                className={`w-10 h-10 rounded-lg shadow-sm border-2 transition-all ${
                  coverColor === color.cover
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
                onClick={() => setEmoji(e)}
                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border-2 transition-all ${
                  emoji === e
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
                background: `linear-gradient(135deg, ${coverColor} 0%, ${spineColor} 100%)`,
                boxShadow:
                  "4px 6px 0px rgba(74,55,40,0.2), inset -8px 0 20px rgba(0,0,0,0.1)",
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-3"
                style={{
                  background: `linear-gradient(to right, ${spineColor}, ${coverColor})`,
                }}
              />
              <div className="text-4xl mb-2">{emoji}</div>
              <div className="text-white font-bold text-sm text-center px-3 leading-tight">
                {title || "书名"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t">
        <Button
          onClick={handleSave}
          disabled={saving || !title || !slug}
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
