"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TiptapEditor } from "@/components/editor/TiptapEditor";

interface BookOption {
  id: string;
  title: string;
}

interface PostEditorFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    coverImage?: string | null;
    published: boolean;
    tags: { id: string; name: string; slug: string }[];
    bookId?: string;
  };
  books?: BookOption[];
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PostEditorForm({ initialData, books = [] }: PostEditorFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags.map((t) => t.name).join(", ") || ""
  );
  const [selectedBookId, setSelectedBookId] = useState(
    initialData?.bookId || (books.length > 0 ? books[0].id : "")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing || !slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleSave = async (shouldPublish: boolean) => {
    setError("");
    setSaving(true);

    const tags = tagsInput
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug,
      content,
      excerpt: excerpt || undefined,
      coverImage: coverImage || undefined,
      published: shouldPublish,
      tags,
      bookId: selectedBookId,
    };

    try {
      const url = isEditing
        ? `/api/posts/${initialData!.slug}`
        : "/api/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "保存失败");
      }

      const post = await res.json();
      router.push("/admin/posts");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">标题 *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="输入文章标题"
            className="mt-1"
          />
        </div>

        {books.length > 0 && (
          <div>
            <Label htmlFor="book">所属书籍</Label>
            <select
              id="book"
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="url-friendly-slug"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            用于URL的标识，只能包含字母、数字和连字符
          </p>
        </div>

        <div>
          <Label htmlFor="excerpt">摘要</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="文章摘要（留空将自动从正文生成）"
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="coverImage">封面图</Label>
          <Input
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="封面图URL"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="tags">标签</Label>
          <Input
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="用逗号分隔多个标签"
            className="mt-1"
          />
        </div>

        <div>
          <Label>正文 *</Label>
          <div className="mt-1">
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="开始写作..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor="published" className="cursor-pointer">
            发布文章
          </Label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t">
        <Button
          onClick={() => handleSave(published)}
          disabled={saving || !title || !slug || !content}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Save className="w-4 h-4 mr-2" />
          {published ? "保存并发布" : "保存草稿"}
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push("/admin/posts")}
          disabled={saving}
        >
          取消
        </Button>
      </div>
    </div>
  );
}
