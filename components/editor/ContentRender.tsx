"use client";

import { useMemo } from "react";

interface ContentRenderProps {
  content: string;
}

export function ContentRender({ content }: ContentRenderProps) {
  const rendered = useMemo(() => {
    try {
      const parsed = JSON.parse(content);
      if (parsed.type === "doc" && Array.isArray(parsed.content)) {
        return parsed.content.map((node: any, i: number) => {
          if (node.type === "paragraph") {
            const text = node.content?.map((c: any) => c.text || "").join("") || "";
            if (!text) return <br key={i} />;
            return (
              <p key={i} className="mb-4 text-foreground/90 leading-relaxed">
                {text}
              </p>
            );
          }
          if (node.type === "heading") {
            const level = node.attrs?.level || 1;
            const text = node.content?.map((c: any) => c.text || "").join("") || "";
            const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
            const classes: Record<number, string> = {
              1: "text-2xl font-bold mt-8 mb-4",
              2: "text-xl font-bold mt-6 mb-3",
              3: "text-lg font-bold mt-4 mb-2",
            };
            return (
              <Tag key={i} className={`${classes[level] || classes[3]} text-foreground`}>
                {text}
              </Tag>
            );
          }
          if (node.type === "bulletList") {
            return (
              <ul key={i} className="list-disc list-inside mb-4 space-y-1">
                {node.content?.map((item: any, j: number) => (
                  <li key={j} className="text-foreground/90">
                    {item.content?.[0]?.content?.map((c: any) => c.text || "").join("")}
                  </li>
                ))}
              </ul>
            );
          }
          if (node.type === "orderedList") {
            return (
              <ol key={i} className="list-decimal list-inside mb-4 space-y-1">
                {node.content?.map((item: any, j: number) => (
                  <li key={j} className="text-foreground/90">
                    {item.content?.[0]?.content?.map((c: any) => c.text || "").join("")}
                  </li>
                ))}
              </ol>
            );
          }
          if (node.type === "blockquote") {
            const text = node.content?.map((c: any) => {
              if (c.type === "paragraph") {
                return c.content?.map((cc: any) => cc.text || "").join("");
              }
              return "";
            }).join("\n") || "";
            return (
              <blockquote
                key={i}
                className="border-l-4 border-amber-400 pl-4 py-2 my-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-r-lg text-foreground/80 italic"
              >
                {text}
              </blockquote>
            );
          }
          if (node.type === "codeBlock") {
            const text = node.content?.map((c: any) => c.text || "").join("") || "";
            return (
              <pre
                key={i}
                className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm"
              >
                <code>{text}</code>
              </pre>
            );
          }
          if (node.type === "horizontalRule") {
            return <hr key={i} className="my-6 border-border" />;
          }
          return null;
        });
      }
    } catch {
      // not JSON, treat as plain text
    }

    // Fallback: render as plain text paragraphs
    return content.split("\n\n").map((paragraph, i) => (
      <p key={i} className="mb-4 text-foreground/90 leading-relaxed">
        {paragraph}
      </p>
    ));
  }, [content]);

  return <div className="prose prose-sm dark:prose-invert max-w-none">{rendered}</div>;
}
