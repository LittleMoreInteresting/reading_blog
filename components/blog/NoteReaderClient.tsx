"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  Tag,
  Sparkles,
} from "lucide-react";

interface Book {
  id: string;
  title: string;
  coverColor: string;
  spineColor: string;
  emoji: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  pageNumber: number;
  tags: string[];
}

interface NavNote {
  id: string;
  title: string;
}

export function NoteReaderClient({
  book,
  note,
  currentIndex,
  totalNotes,
  prevNote,
  nextNote,
}: {
  book: Book;
  note: Note;
  currentIndex: number;
  totalNotes: number;
  prevNote: NavNote | null;
  nextNote: NavNote | null;
}) {
  const [pageDirection, setPageDirection] = useState<"left" | "right" | null>(
    null
  );

  useEffect(() => {
    setPageDirection(null);
  }, [note.id]);

  const contentParagraphs = note.content.split("\n\n");

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="px-4 md:px-6 pt-4 md:pt-6 pb-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-4xl mx-auto flex items-center justify-between"
        >
          <Link
            href={`/book/${book.id}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回目录</span>
          </Link>

          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>
              {currentIndex + 1} / {totalNotes}
            </span>
          </div>
        </motion.div>
      </header>

      {/* 阅读区域 */}
      <main className="flex-1 px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-4xl mx-auto">
          {/* 移动端 */}
          <div className="md:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={note.id}
                initial={
                  pageDirection === "left"
                    ? { opacity: 0, x: 30 }
                    : pageDirection === "right"
                    ? { opacity: 0, x: -30 }
                    : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={
                  pageDirection === "left"
                    ? { opacity: 0, x: -30 }
                    : { opacity: 0, x: 30 }
                }
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                  <div
                    className="h-2"
                    style={{
                      background: `linear-gradient(to right, ${book.coverColor}, ${book.spineColor})`,
                    }}
                  />

                  <div className="p-4">
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <BookOpen className="w-3 h-3" />
                        <span>{book.title}</span>
                        <span className="text-border">|</span>
                        <Calendar className="w-3 h-3" />
                        <span>{note.createdAt}</span>
                      </div>

                      <h1 className="text-lg font-bold text-foreground mb-2">
                        {note.title}
                      </h1>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-xs bg-accent/50 text-foreground px-2 py-0.5 rounded-full"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                    <div className="space-y-3 mt-4">
                      {contentParagraphs.map((paragraph, idx) => (
                        <motion.p
                          key={idx}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + idx * 0.06 }}
                          className="text-sm text-foreground/90 leading-relaxed"
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>

                    <div className="text-center text-xs text-muted-foreground mt-4 pt-3 border-t border-dashed border-border">
                      - 第 {note.pageNumber} 页 -
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-border"
                >
                  <h3 className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    阅读进度
                  </h3>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(to right, ${book.coverColor}, ${book.spineColor})`,
                      }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          ((currentIndex + 1) / totalNotes) * 100
                        }%`,
                      }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    已读 {currentIndex + 1} / {totalNotes} 篇
                  </p>
                </motion.div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {prevNote ? (
                    <Link href={`/book/${book.id}/note/${prevNote.id}`}>
                      <motion.div
                        className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-primary/5 transition-colors active:scale-[0.97]"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setPageDirection("left")}
                      >
                        <ChevronLeft className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground">上一篇</p>
                          <p className="text-xs font-semibold text-foreground truncate">
                            {prevNote.title}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 text-muted-foreground">
                      <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                      <span className="text-xs">没有了</span>
                    </div>
                  )}

                  {nextNote ? (
                    <Link href={`/book/${book.id}/note/${nextNote.id}`}>
                      <motion.div
                        className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-primary/5 transition-colors active:scale-[0.97] text-right justify-end"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setPageDirection("right")}
                      >
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground">下一篇</p>
                          <p className="text-xs font-semibold text-foreground truncate">
                            {nextNote.title}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
                      </motion.div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 text-muted-foreground justify-end">
                      <span className="text-xs">没有了</span>
                      <ChevronRight className="w-5 h-5 flex-shrink-0" />
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 桌面端 */}
          <div className="hidden md:block">
            <div className="book-3d flex justify-center">
              <div className="relative w-full max-w-3xl aspect-[4/3] flex">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={note.id}
                    className="absolute inset-0 flex"
                    initial={
                      pageDirection === "left"
                        ? { rotateY: 45, opacity: 0, x: 50 }
                        : pageDirection === "right"
                        ? { rotateY: -45, opacity: 0, x: -50 }
                        : { opacity: 0, scale: 0.95 }
                    }
                    animate={{ rotateY: 0, opacity: 1, x: 0, scale: 1 }}
                    exit={
                      pageDirection === "left"
                        ? { rotateY: -45, opacity: 0, x: -50 }
                        : { rotateY: 45, opacity: 0, x: 50 }
                    }
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* 左页 - 笔记内容 */}
                    <div className="flex-1 book-page rounded-l-2xl rounded-r-sm p-6 md:p-8 flex flex-col relative overflow-hidden">
                      <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-primary/20 rounded-tl-xl" />

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <BookOpen className="w-3 h-3" />
                          <span>{book.title}</span>
                          <span className="text-border">|</span>
                          <Calendar className="w-3 h-3" />
                          <span>{note.createdAt}</span>
                        </div>

                        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                          {note.title}
                        </h1>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 text-xs bg-accent/50 text-foreground px-2 py-0.5 rounded-full"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>

                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-4"
                        >
                          {contentParagraphs.map((paragraph, idx) => (
                            <motion.p
                              key={idx}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + idx * 0.08 }}
                              className="text-sm md:text-base text-foreground/90 leading-relaxed"
                            >
                              {paragraph}
                            </motion.p>
                          ))}
                        </motion.div>
                      </div>

                      <div className="text-center text-xs text-muted-foreground mt-3 pt-3 border-t border-dashed border-border">
                        - 第 {note.pageNumber} 页 -
                      </div>
                    </div>

                    <div className="w-px bg-gradient-to-b from-transparent via-amber-900/20 to-transparent" />

                    {/* 右页 - 互动区 */}
                    <div className="flex-1 book-page rounded-r-2xl rounded-l-sm p-6 md:p-8 flex flex-col relative overflow-hidden">
                      <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-primary/20 rounded-tr-xl" />

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                      >
                        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-accent" />
                          阅读进度
                        </h3>
                        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(to right, ${book.coverColor}, ${book.spineColor})`,
                            }}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${
                                ((currentIndex + 1) / totalNotes) * 100
                              }%`,
                            }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          已读 {currentIndex + 1} / {totalNotes} 篇
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex-1 flex flex-col justify-end gap-3"
                      >
                        <h3 className="font-bold text-foreground mb-1">
                          翻页导航
                        </h3>

                        {prevNote ? (
                          <Link href={`/book/${book.id}/note/${prevNote.id}`}>
                            <motion.div
                              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-primary/5 transition-colors cursor-pointer border border-transparent hover:border-primary/20"
                              whileHover={{ x: -4 }}
                              onClick={() => setPageDirection("left")}
                            >
                              <ChevronLeft className="w-5 h-5 text-primary flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">
                                  上一篇
                                </p>
                                <p className="text-sm font-semibold text-foreground truncate">
                                  {prevNote.title}
                                </p>
                              </div>
                            </motion.div>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 text-muted-foreground">
                            <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">已经是第一篇了</span>
                          </div>
                        )}

                        {nextNote ? (
                          <Link href={`/book/${book.id}/note/${nextNote.id}`}>
                            <motion.div
                              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-primary/5 transition-colors cursor-pointer border border-transparent hover:border-primary/20"
                              whileHover={{ x: 4 }}
                              onClick={() => setPageDirection("right")}
                            >
                              <div className="flex-1 min-w-0 text-right">
                                <p className="text-xs text-muted-foreground">
                                  下一篇
                                </p>
                                <p className="text-sm font-semibold text-foreground truncate">
                                  {nextNote.title}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
                            </motion.div>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 text-muted-foreground">
                            <span className="text-sm flex-1 text-right">
                              已经是最后一篇了
                            </span>
                            <ChevronRight className="w-5 h-5 flex-shrink-0" />
                          </div>
                        )}
                      </motion.div>

                      <motion.div
                        className="absolute bottom-4 right-4 text-4xl opacity-20"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        {book.emoji}
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
