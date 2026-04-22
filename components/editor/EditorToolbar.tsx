"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Undo,
  Redo,
  Eraser,
  type LucideIcon,
} from "lucide-react";
import { useCallback } from "react";

interface EditorToolbarProps {
  editor: Editor;
}

interface ToolbarButton {
  icon: LucideIcon;
  action: () => void;
  disabled?: boolean;
  active?: boolean;
  title: string;
}

interface ToolbarDivider {
  divider: true;
}

type ToolbarItem = ToolbarButton | ToolbarDivider;

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const setLink = useCallback(() => {
    const url = window.prompt("输入链接地址:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("输入图片地址:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const toolbarButtons: ToolbarItem[] = [
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
      title: "撤销",
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
      title: "重做",
    },
    { divider: true },
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
      title: "标题1",
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      title: "标题2",
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      title: "标题3",
    },
    { divider: true },
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      title: "加粗",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      title: "斜体",
    },
    {
      icon: UnderlineIcon,
      action: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive("underline"),
      title: "下划线",
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
      title: "删除线",
    },
    { divider: true },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      title: "无序列表",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      title: "有序列表",
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
      title: "引用",
    },
    { divider: true },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive("codeBlock"),
      title: "代码块",
    },
    {
      icon: Code2,
      action: () => editor.chain().focus().toggleCode().run(),
      active: editor.isActive("code"),
      title: "行内代码",
    },
    {
      icon: LinkIcon,
      action: setLink,
      active: editor.isActive("link"),
      title: "链接",
    },
    {
      icon: ImageIcon,
      action: addImage,
      title: "图片",
    },
    {
      icon: Minus,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      title: "分割线",
    },
    { divider: true },
    {
      icon: Eraser,
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
      title: "清除格式",
    },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-900">
      {toolbarButtons.map((item, index) => {
        if ("divider" in item) {
          return (
            <div
              key={index}
              className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center"
            />
          );
        }

        const button = item as ToolbarButton;
        const Icon = button.icon;
        return (
          <button
            key={index}
            type="button"
            onClick={button.action}
            disabled={button.disabled}
            title={button.title}
            className={`p-1.5 rounded transition-colors ${
              button.active
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            } ${button.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
