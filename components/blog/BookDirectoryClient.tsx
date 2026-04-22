"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  FileText,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  spineColor: string;
  emoji: string;
  totalNotes: number;
  description: string;
}

interface Note {
  id: string;
  bookId: string;
  title: string;
  content: string;
  pageNumber: number;
  createdAt: string;
  tags: string[];
}

export function BookDirectoryClient({
  book,
  notes,
}: {
  book: Book;
  notes: Note[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="px-4 md:px-6 pt-4 md:pt-6 pb-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回书架</span>
          </Link>
        </motion.div>
      </header>

      {/* 翻书动画区域 */}
      <main className="flex-1 px-4 md:px-6 py-4 md:py-6 flex items-start md:items-center justify-center">
        <div className="max-w-4xl w-full">
          {/* 移动端 */}
          <div className="md:hidden">
            <AnimatePresence>
              {!isOpen ? (
                <motion.div
                  key="cover-mobile"
                  className="flex items-center justify-center py-10"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="w-48 h-64 rounded-r-2xl rounded-l-sm shadow-2xl flex flex-col items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${book.coverColor} 0%, ${book.spineColor} 100%)`,
                      boxShadow:
                        "8px 10px 0px rgba(74,55,40,0.2), inset -10px 0 30px rgba(0,0,0,0.15)",
                    }}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-4"
                      style={{
                        background: `linear-gradient(to right, ${book.spineColor}, ${book.coverColor})`,
                        boxShadow: "inset -3px 0 5px rgba(0,0,0,0.3)",
                      }}
                    />
                    <motion.div
                      className="text-6xl mb-3"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {book.emoji}
                    </motion.div>
                    <h2 className="text-white text-xl font-bold drop-shadow-lg px-4 text-center">
                      {book.title}
                    </h2>
                    <p className="text-white/80 mt-1 text-sm">{book.author}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content-mobile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div
                    className="rounded-2xl p-5 text-white relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${book.coverColor} 0%, ${book.spineColor} 100%)`,
                      boxShadow: "4px 6px 0px rgba(74,55,40,0.2)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{book.emoji}</span>
                      <div>
                        <h2 className="text-lg font-bold">{book.title}</h2>
                        <p className="text-white/80 text-sm">{book.author}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-white/90 italic leading-relaxed">
                      「{book.description}」
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
                      <BookOpen className="w-4 h-4" />
                      <span>{book.totalNotes} 篇笔记</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-foreground">笔记目录</h3>
                      <Sparkles className="w-4 h-4 text-accent animate-sparkle" />
                    </div>

                    <div className="space-y-2">
                      {notes.length > 0 ? (
                        notes.map((note, index) => (
                          <Link
                            key={note.id}
                            href={`/book/${book.id}/note/${note.id}`}
                          >
                            <motion.div
                              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-primary/5 transition-colors active:scale-[0.98]"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.08 }}
                            >
                              <span className="text-primary font-bold text-sm min-w-[1.5rem]">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground text-sm truncate">
                                  {note.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  <span>{note.createdAt}</span>
                                  <span className="text-border">|</span>
                                  <span>第 {note.pageNumber} 页</span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            </motion.div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>这本书还没有笔记呢 ✏️</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 桌面端 */}
          <div className="hidden md:block">
            <div className="book-3d flex justify-center">
              <div className="relative w-full max-w-3xl aspect-[4/3]">
                <AnimatePresence>
                  {!isOpen ? (
                    <motion.div
                      key="cover"
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ rotateY: 0 }}
                      exit={{ rotateY: -160, opacity: 0.8 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      style={{
                        transformOrigin: "left center",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div
                        className="w-full max-w-sm h-80 rounded-r-2xl rounded-l-sm shadow-2xl flex flex-col items-center justify-center relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${book.coverColor} 0%, ${book.spineColor} 100%)`,
                          boxShadow:
                            "8px 10px 0px rgba(74,55,40,0.2), inset -10px 0 30px rgba(0,0,0,0.15)",
                        }}
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 w-4"
                          style={{
                            background: `linear-gradient(to right, ${book.spineColor}, ${book.coverColor})`,
                            boxShadow: "inset -3px 0 5px rgba(0,0,0,0.3)",
                          }}
                        />
                        <motion.div
                          className="text-7xl mb-4"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          {book.emoji}
                        </motion.div>
                        <h2 className="text-white text-2xl font-bold drop-shadow-lg">
                          {book.title}
                        </h2>
                        <p className="text-white/80 mt-2">{book.author}</p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {isOpen ? (
                    <motion.div
                      key="open-book"
                      className="absolute inset-0 flex"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <motion.div
                        className="flex-1 book-page rounded-l-2xl rounded-r-sm p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-primary/30 rounded-tl-2xl" />
                        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-primary/30 rounded-br-2xl" />

                        <motion.div
                          className="text-6xl mb-4"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.7 }}
                        >
                          {book.emoji}
                        </motion.div>
                        <h2 className="text-2xl font-bold text-foreground text-center">
                          {book.title}
                        </h2>
                        <p className="text-muted-foreground mt-2 text-center">
                          {book.author}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="w-4 h-4" />
                          <span>{book.totalNotes} 篇笔记</span>
                        </div>
                        <p className="mt-6 text-sm text-muted-foreground text-center max-w-xs italic leading-relaxed">
                          「{book.description}」
                        </p>
                      </motion.div>

                      <div className="w-px bg-gradient-to-b from-transparent via-amber-900/20 to-transparent" />

                      <motion.div
                        className="flex-1 book-page rounded-r-2xl rounded-l-sm p-6 md:p-8 relative overflow-hidden"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-primary/30 rounded-tr-2xl" />

                        <div className="flex items-center gap-2 mb-6">
                          <FileText className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-bold text-foreground">
                            目录
                          </h3>
                          <Sparkles className="w-4 h-4 text-accent animate-sparkle" />
                        </div>

                        <div className="space-y-3">
                          {notes.length > 0 ? (
                            notes.map((note, index) => (
                              <motion.div
                                key={note.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                              >
                                <Link
                                  href={`/book/${book.id}/note/${note.id}`}
                                >
                                  <motion.div
                                    className="group flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer border border-transparent hover:border-primary/20"
                                    whileHover={{ x: 4 }}
                                  >
                                    <span className="text-primary font-bold text-sm mt-0.5 min-w-[2rem]">
                                      {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">
                                        {note.title}
                                      </h4>
                                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        <span>{note.createdAt}</span>
                                        <span className="text-border">|</span>
                                        <span>第 {note.pageNumber} 页</span>
                                      </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
                                  </motion.div>
                                </Link>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-10 text-muted-foreground">
                              <p>这本书还没有笔记呢 ✏️</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
