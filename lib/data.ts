export interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  coverGradient: string;
  spineColor: string;
  emoji: string;
  totalNotes: number;
  lastReadAt: string;
  description: string;
}

export interface Note {
  id: string;
  bookId: string;
  title: string;
  content: string;
  pageNumber: number;
  createdAt: string;
  tags: string[];
}

export const books: Book[] = [
  {
    id: "1",
    title: "小王子",
    author: "安托万·德·圣-埃克苏佩里",
    coverColor: "#FFD93D",
    coverGradient: "from-amber-300 via-yellow-300 to-orange-300",
    spineColor: "#F59E0B",
    emoji: "🌹",
    totalNotes: 8,
    lastReadAt: "2026-04-15",
    description: "所有的大人都曾经是小孩，虽然只有少数人记得。",
  },
  {
    id: "2",
    title: "解忧杂货店",
    author: "东野圭吾",
    coverColor: "#A78BFA",
    coverGradient: "from-violet-300 via-purple-300 to-fuchsia-300",
    spineColor: "#8B5CF6",
    emoji: "📮",
    totalNotes: 12,
    lastReadAt: "2026-03-28",
    description: "现代人内心流失的东西，这家杂货店能帮你找回。",
  },
  {
    id: "3",
    title: "三体",
    author: "刘慈欣",
    coverColor: "#60A5FA",
    coverGradient: "from-blue-300 via-sky-300 to-cyan-300",
    spineColor: "#3B82F6",
    emoji: "🌌",
    totalNotes: 15,
    lastReadAt: "2026-04-20",
    description: "给岁月以文明，而不是给文明以岁月。",
  },
  {
    id: "4",
    title: "百年孤独",
    author: "加西亚·马尔克斯",
    coverColor: "#34D399",
    coverGradient: "from-emerald-300 via-teal-300 to-green-300",
    spineColor: "#10B981",
    emoji: "🦋",
    totalNotes: 6,
    lastReadAt: "2026-02-10",
    description: "过去都是假的，回忆是一条没有归途的路。",
  },
  {
    id: "5",
    title: "挪威的森林",
    author: "村上春树",
    coverColor: "#F472B6",
    coverGradient: "from-pink-300 via-rose-300 to-red-300",
    spineColor: "#EC4899",
    emoji: "🌲",
    totalNotes: 10,
    lastReadAt: "2026-04-05",
    description: "死并非生的对立面，而作为生的一部分永存。",
  },
  {
    id: "6",
    title: "月亮与六便士",
    author: "毛姆",
    coverColor: "#FB923C",
    coverGradient: "from-orange-300 via-amber-300 to-yellow-300",
    spineColor: "#F97316",
    emoji: "🌙",
    totalNotes: 7,
    lastReadAt: "2026-03-15",
    description: "满地都是六便士，他却抬头看见了月亮。",
  },
  {
    id: "7",
    title: "活着",
    author: "余华",
    coverColor: "#F87171",
    coverGradient: "from-red-300 via-rose-300 to-pink-300",
    spineColor: "#EF4444",
    emoji: "🌾",
    totalNotes: 9,
    lastReadAt: "2026-04-18",
    description: "人是为了活着本身而活着，而不是为了活着之外的任何事物。",
  },
  {
    id: "8",
    title: "围城",
    author: "钱钟书",
    coverColor: "#94A3B8",
    coverGradient: "from-slate-300 via-gray-300 to-zinc-300",
    spineColor: "#64748B",
    emoji: "🏰",
    totalNotes: 11,
    lastReadAt: "2026-03-20",
    description: "城里的人想出去，城外的人想进来。",
  },
  {
    id: "9",
    title: "红楼梦",
    author: "曹雪芹",
    coverColor: "#E879F9",
    coverGradient: "from-fuchsia-300 via-purple-300 to-violet-300",
    spineColor: "#C026D3",
    emoji: "🏮",
    totalNotes: 20,
    lastReadAt: "2026-04-10",
    description: "满纸荒唐言，一把辛酸泪。都云作者痴，谁解其中味。",
  },
  {
    id: "10",
    title: "白夜行",
    author: "东野圭吾",
    coverColor: "#475569",
    coverGradient: "from-slate-500 via-gray-500 to-zinc-500",
    spineColor: "#334155",
    emoji: "🌑",
    totalNotes: 14,
    lastReadAt: "2026-03-05",
    description: "我的天空里没有太阳，总是黑夜，但并不暗，因为有东西代替了太阳。",
  },
  {
    id: "11",
    title: "追风筝的人",
    author: "卡勒德·胡赛尼",
    coverColor: "#22D3EE",
    coverGradient: "from-cyan-300 via-sky-300 to-blue-300",
    spineColor: "#06B6D4",
    emoji: "🪁",
    totalNotes: 8,
    lastReadAt: "2026-04-01",
    description: "为你，千千万万遍。",
  },
  {
    id: "12",
    title: "霍乱时期的爱情",
    author: "加西亚·马尔克斯",
    coverColor: "#FB7185",
    coverGradient: "from-rose-300 via-pink-300 to-red-300",
    spineColor: "#E11D48",
    emoji: "💌",
    totalNotes: 10,
    lastReadAt: "2026-02-28",
    description: "爱情是一种病，和霍乱的症状一模一样。",
  },
  {
    id: "13",
    title: "局外人",
    author: "加缪",
    coverColor: "#A8A29E",
    coverGradient: "from-stone-300 via-stone-400 to-stone-500",
    spineColor: "#78716C",
    emoji: "☀️",
    totalNotes: 6,
    lastReadAt: "2026-03-22",
    description: "今天，妈妈死了。也许是昨天，我不知道。",
  },
  {
    id: "14",
    title: "恶意",
    author: "东野圭吾",
    coverColor: "#1E293B",
    coverGradient: "from-slate-700 via-slate-800 to-gray-900",
    spineColor: "#0F172A",
    emoji: "🗡️",
    totalNotes: 9,
    lastReadAt: "2026-04-12",
    description: "有些人的恨是没有原因的，他们平庸、没有天分、碌碌无为。",
  },
  {
    id: "15",
    title: "平凡的世界",
    author: "路遥",
    coverColor: "#65A30D",
    coverGradient: "from-lime-300 via-green-300 to-emerald-300",
    spineColor: "#4D7C0F",
    emoji: "🏔️",
    totalNotes: 16,
    lastReadAt: "2026-04-08",
    description: "生活不能等待别人来安排，要自己去争取和奋斗。",
  },
  {
    id: "16",
    title: "杀死一只知更鸟",
    author: "哈珀·李",
    coverColor: "#FCD34D",
    coverGradient: "from-amber-200 via-yellow-200 to-orange-200",
    spineColor: "#D97706",
    emoji: "🐦",
    totalNotes: 7,
    lastReadAt: "2026-03-30",
    description: "你永远不会真正了解一个人，除非你穿上他的鞋子走来走去。",
  },
  {
    id: "17",
    title: "了不起的盖茨比",
    author: "菲茨杰拉德",
    coverColor: "#38BDF8",
    coverGradient: "from-sky-300 via-cyan-300 to-teal-300",
    spineColor: "#0284C7",
    emoji: "💎",
    totalNotes: 8,
    lastReadAt: "2026-02-15",
    description: "于是我们奋力向前划，逆流向上的小舟，不停地倒退，进入过去。",
  },
  {
    id: "18",
    title: "简爱",
    author: "夏洛蒂·勃朗特",
    coverColor: "#C084FC",
    coverGradient: "from-purple-300 via-violet-300 to-fuchsia-300",
    spineColor: "#9333EA",
    emoji: "🕯️",
    totalNotes: 5,
    lastReadAt: "2026-03-10",
    description: "我们的灵魂是平等的，就仿佛我们两人穿过坟墓，站在上帝脚下。",
  },
  {
    id: "19",
    title: "老人与海",
    author: "海明威",
    coverColor: "#2DD4BF",
    coverGradient: "from-teal-300 via-cyan-300 to-sky-300",
    spineColor: "#0D9488",
    emoji: "🎣",
    totalNotes: 6,
    lastReadAt: "2026-04-02",
    description: "一个人可以被毁灭，但不能被打败。",
  },
  {
    id: "20",
    title: "人类简史",
    author: "尤瓦尔·赫拉利",
    coverColor: "#D4D4D8",
    coverGradient: "from-zinc-200 via-gray-200 to-slate-200",
    spineColor: "#52525B",
    emoji: "🌍",
    totalNotes: 13,
    lastReadAt: "2026-04-19",
    description: "历史从无正义，只有胜利者的叙述。",
  },
];

export const notes: Record<string, Note[]> = {
  "1": [
    {
      id: "n1-1",
      bookId: "1",
      title: "驯服的意义",
      content:
        "如果你驯服了我，我们就彼此需要了。对我来说，你就是世界上独一无二的；对你来说，我也是世界上独一无二的……\n\n这段话让我思考人与人之间关系的本质。驯服不是征服，而是建立连接。在现代社会，我们常常被教导要独立、要强大，却忽略了脆弱和依赖的价值。\n\n真正的亲密关系需要时间的浇灌，需要耐心的等待。就像狐狸说的那样：『你要永远为你驯服的东西负责。』",
      pageNumber: 21,
      createdAt: "2026-04-15",
      tags: ["爱情", "关系"],
    },
    {
      id: "n1-2",
      bookId: "1",
      title: "大人们的世界",
      content:
        "所有的大人都曾经是小孩，虽然只有少数人记得。\n\n这句话像一面镜子，照出了我们成长过程中的遗憾。小时候我们拥有无穷的想象力和好奇心，但随着年龄增长，这些东西被所谓的『成熟』一点点磨平。\n\n或许保持一颗童心，不是幼稚，而是一种难得的智慧。",
      pageNumber: 8,
      createdAt: "2026-04-14",
      tags: ["成长", "思考"],
    },
    {
      id: "n1-3",
      bookId: "1",
      title: "玫瑰与狐狸",
      content:
        "正因为你为你的玫瑰花费了时间，这才使你的玫瑰变得如此重要。\n\n爱与付出是相辅相成的。我们不是因为某样东西珍贵才付出，而是因为付出了，它才变得珍贵。\n\n这让我想到了自己生活中的种种——那些倾注了心血的事物，无论结果如何，过程本身就赋予了它们意义。",
      pageNumber: 63,
      createdAt: "2026-04-13",
      tags: ["爱情", "哲理"],
    },
  ],
  "2": [
    {
      id: "n2-1",
      bookId: "2",
      title: "解忧的智慧",
      content:
        "其实所有纠结做选择的人心里早就有了答案，咨询只是想得到内心所倾向的选择。\n\n这句话点破了很多人寻求建议的真相。我们并非不知道该怎么选，只是缺乏迈出那一步的勇气。\n\n有时候，倾听自己内心的声音，比听任何外界的意见都重要。",
      pageNumber: 45,
      createdAt: "2026-03-28",
      tags: ["选择", "人生"],
    },
    {
      id: "n2-2",
      bookId: "2",
      title: "时空的交汇",
      content:
        "过去和现在、现在和未来，在杂货店的信箱里奇妙地交织在一起。\n\n东野圭吾巧妙地将不同时空的故事串联，让读者感受到命运的神奇。每一个看似微不足道的选择，都可能在不经意间改变人生的轨迹。\n\n这种叙事手法也让我思考：如果可以给过去的自己写一封信，我会说些什么？",
      pageNumber: 120,
      createdAt: "2026-03-27",
      tags: ["时空", "命运"],
    },
  ],
  "3": [
    {
      id: "n3-1",
      bookId: "3",
      title: "黑暗森林法则",
      content:
        "宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间。\n\n刘慈欣用冷酷的逻辑推导出了这个令人不寒而栗的宇宙图景。猜疑链和技术爆炸这两个概念，让整个故事有了坚实的理论基础。\n\n虽然这只是科幻设定，但它让我反思人类社会的信任机制——在信息不完全的情况下，猜疑往往是最理性的选择，却也是最 destructive 的。",
      pageNumber: 200,
      createdAt: "2026-04-20",
      tags: ["科幻", "哲学"],
    },
    {
      id: "n3-2",
      bookId: "3",
      title: "面壁者与破壁人",
      content:
        "最强的面壁者是罗辑，因为他真的把自己当成了面壁者。\n\n其他面壁者都在用自己的方式对抗三体，只有罗辑在无意中发现了宇宙社会学的公理。\n\n这给了我一个启示：有时候，最有价值的发现来自于看似无关的思考，而不是目标明确的努力。",
      pageNumber: 350,
      createdAt: "2026-04-19",
      tags: ["策略", "思维"],
    },
  ],
  "4": [
    {
      id: "n4-1",
      bookId: "4",
      title: "孤独的家族",
      content:
        "家族中的第一个人被绑在树上，最后一个人被蚂蚁吃掉。\n\n这句话是整部小说的缩影——布恩迪亚家族七代人的命运，都在这个魔咒般的循环中展开。\n\n孤独是这本书最核心的主题。每个人都在自己的孤独中挣扎，却无法真正与他人连接。这种孤独不是选择，而是宿命。",
      pageNumber: 360,
      createdAt: "2026-02-10",
      tags: ["孤独", "家族"],
    },
  ],
  "5": [
    {
      id: "n5-1",
      bookId: "5",
      title: "挪威的森林",
      content:
        "死并非生的对立面，而作为生的一部分永存。\n\n村上春树的文字有一种奇特的平静感。他描写死亡、失落、迷茫，却不让人觉得沉重。\n\n渡边在两个女孩之间的徘徊，既是对爱情的探索，也是对自我的寻找。直子代表过去和羁绊，绿子代表现实和希望。",
      pageNumber: 88,
      createdAt: "2026-04-05",
      tags: ["生死", "青春"],
    },
  ],
  "6": [
    {
      id: "n6-1",
      bookId: "6",
      title: "追寻月亮的人",
      content:
        "我必须画画，就像溺水的人必须挣扎。\n\n斯特里克兰德抛妻弃子、放弃稳定的生活，只为追求心中的艺术。这种极端的选择让人既敬佩又恐惧。\n\n我们大多数人都在月亮和六便士之间摇摆，既想要理想的光芒，又舍不得现实的温暖。而斯特里克兰德告诉我们：真正的天才不需要选择，因为他们无法不去做。",
      pageNumber: 150,
      createdAt: "2026-03-15",
      tags: ["艺术", "追求"],
    },
  ],
};

export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id);
}

export function getNotesByBookId(bookId: string): Note[] {
  return notes[bookId] || [];
}

export function getNoteById(noteId: string): Note | undefined {
  for (const bookNotes of Object.values(notes)) {
    const note = bookNotes.find((n) => n.id === noteId);
    if (note) return note;
  }
  return undefined;
}
