import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "读书笔记小铺 | Reading Notes",
  description: "一本本书记录，一页页心得",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col cloud-bg">
        {children}
      </body>
    </html>
  );
}
