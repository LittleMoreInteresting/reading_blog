"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Sparkles, Library } from "lucide-react";

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

const SHELF_CAPACITY = 6;

function BookCard({ book, index }: { book: Book; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, type: "spring" }}
      className="flex-shrink-0"
    >
      <Link href={`/book/${book.id}`}>
        <motion.div
          className="group relative cursor-pointer"
          whileHover={{ scale: 1.05, y: -8 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="relative flex flex-col items-center">
            <div
              className="relative w-28 h-40 sm:w-32 sm:h-44 md:w-44 md:h-60 rounded-r-2xl rounded-l-sm shadow-xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${book.coverColor} 0%, ${book.spineColor} 100%)`,
                boxShadow:
                  "4px 6px 0px rgba(74,55,40,0.2), inset -8px 0 20px rgba(0,0,0,0.1), inset 4px 0 10px rgba(255,255,255,0.3)",
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-3"
                style={{
                  background: `linear-gradient(to right, ${book.spineColor}, ${book.coverColor})`,
                  boxShadow: "inset -2px 0 4px rgba(0,0,0,0.2)",
                }}
              />
              <div className="absolute right-0 top-2 bottom-2 w-2 bg-amber-50 rounded-r opacity-60" />

              <div className="flex flex-col items-center justify-center h-full px-4 pl-6">
                <motion.div
                  className="text-4xl md:text-5xl mb-3"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                >
                  {book.emoji}
                </motion.div>
                <h3 className="text-white font-bold text-center text-xs md:text-sm leading-tight drop-shadow-md">
                  {book.title}
                </h3>
                <p className="text-white/80 text-[10px] md:text-xs mt-1 text-center">
                  {book.author}
                </p>
              </div>

              <div className="absolute top-2 right-2 bg-white/90 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                {book.totalNotes} 篇
              </div>
            </div>

            <div className="w-24 sm:w-28 md:w-36 h-3 bg-black/10 rounded-full mt-2 blur-sm group-hover:bg-black/15 transition-all" />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function BookshelfRow({
  shelfBooks,
  shelfIndex,
}: {
  shelfBooks: Book[];
  shelfIndex: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: shelfIndex * 0.15, duration: 0.5 }}
      className="relative"
    >
      <div
        className="absolute inset-x-0 top-0 bottom-4 rounded-lg -z-10"
        style={{
          background: "linear-gradient(to bottom, #8B6914 0%, #6B5010 100%)",
          boxShadow: "inset 0 4px 10px rgba(0,0,0,0.3)",
        }}
      />

      <div className="flex items-end justify-start gap-3 md:gap-5 px-4 md:px-8 pt-6 pb-2 overflow-x-auto scrollbar-hide">
        {shelfBooks.map((book, index) => (
          <BookCard
            key={book.id}
            book={book}
            index={shelfIndex * SHELF_CAPACITY + index}
          />
        ))}
        {shelfBooks.length < SHELF_CAPACITY &&
          Array.from({ length: SHELF_CAPACITY - shelfBooks.length }).map(
            (_, i) => (
              <div
                key={`empty-${i}`}
                className="w-28 sm:w-32 md:w-44 flex-shrink-0"
              />
            )
          )}
      </div>

      <div className="relative mx-1">
        <div
          className="h-5 rounded-md"
          style={{
            background: "linear-gradient(to bottom, #D4A574 0%, #B8936B 50%, #A08060 100%)",
            boxShadow:
              "0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        />
        <div className="absolute inset-x-0 top-1/2 h-px bg-amber-900/10" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/20 rounded-t-md" />
      </div>
    </motion.div>
  );
}

export function BookshelfClient({ books }: { books: Book[] }) {
  const shelves: Book[][] = [];
  for (let i = 0; i < books.length; i += SHELF_CAPACITY) {
    shelves.push(books.slice(i, i + SHELF_CAPACITY));
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="pt-6 md:pt-8 pb-2 md:pb-4 px-4 md:px-6">
        <motion.div
          className="max-w-5xl mx-auto flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Library className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            </motion.div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              读书笔记小铺
            </h1>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
            <Sparkles className="w-4 h-4" />
            <span>共 {books.length} 本书</span>
          </div>
        </motion.div>
      </header>

      <motion.section
        className="text-center px-4 md:px-6 py-6 md:py-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 md:px-5 py-2 rounded-full hand-drawn-border mb-3 md:mb-4"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          <span className="font-bold text-foreground text-sm md:text-base">
            翻开一本书，走进一段故事
          </span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2 tracking-tight">
          我的书架
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
          每一本书都是一次奇妙的冒险，记录那些触动心灵的瞬间
        </p>
      </motion.section>

      <main className="flex-1 px-3 md:px-6 pb-8 md:pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div
              className="rounded-xl p-2 md:p-3"
              style={{
                background: "linear-gradient(to right, #7A5C12, #9A7B32, #7A5C12)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="h-4 md:h-6 rounded-t-lg mb-1"
                style={{
                  background: "linear-gradient(to bottom, #E8C9A0, #D4A574)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />

              <div className="space-y-0">
                {shelves.map((shelfBooks, index) => (
                  <BookshelfRow
                    key={index}
                    shelfBooks={shelfBooks}
                    shelfIndex={index}
                  />
                ))}
              </div>

              <div
                className="h-5 md:h-7 rounded-b-lg mt-1"
                style={{
                  background: "linear-gradient(to bottom, #D4A574, #B8936B)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                }}
              />
            </div>

            <div className="flex justify-between px-8 md:px-16 -mt-1">
              <div
                className="w-4 md:w-6 h-8 md:h-10 rounded-b-sm"
                style={{
                  background: "linear-gradient(to right, #6B5010, #8B6914)",
                }}
              />
              <div
                className="w-4 md:w-6 h-8 md:h-10 rounded-b-sm"
                style={{
                  background: "linear-gradient(to right, #6B5010, #8B6914)",
                }}
              />
            </div>
          </div>

          <motion.div
            className="text-center mt-8 md:mt-10 text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p>点击任意一本书，开始阅读之旅 ✨</p>
          </motion.div>
        </div>
      </main>

      <footer className="py-4 md:py-6 text-center text-muted-foreground text-xs md:text-sm">
        <p>Made with love and lots of books 📚</p>
      </footer>
    </div>
  );
}
