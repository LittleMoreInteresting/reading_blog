"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { EditorToolbar } from "./EditorToolbar";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || "开始写作...",
      }),
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content ? JSON.parse(content) : "",
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
  });

  if (!editor) {
    return (
      <div className="border rounded-lg p-4 min-h-[400px] bg-gray-50 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
