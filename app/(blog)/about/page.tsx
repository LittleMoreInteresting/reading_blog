import { Header } from "@/components/blog/Header";
import { BookOpen, Heart, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-2xl mx-auto px-4 md:px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
              <BookOpen className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              关于读书笔记小铺
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              记录阅读中的思考与收获
            </p>
          </div>

          <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              欢迎来到读书笔记小铺！这里是一个记录阅读心得的个人空间。
              每一本书都是一次奇妙的冒险，每一段文字都可能触动心灵。
            </p>

            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  为什么要记录读书笔记？
                </h3>
                <p className="text-sm">
                  阅读不仅是输入，更是思考的过程。通过记录，我们可以更好地消化书中的智慧，
                  将作者的思想与自己的生活经验连接，最终内化为自己的知识。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
              <Heart className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  在这里你可以找到
                </h3>
                <p className="text-sm">
                  文学经典的深度解读、科幻小说的脑洞解析、哲学著作的思考感悟……
                  每一篇笔记都是用心写就，希望能给你带来一些启发。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
