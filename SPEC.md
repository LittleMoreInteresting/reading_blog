# 读书笔记博客系统 SPEC

## 1. 项目概述

开发一款面向个人的读书笔记博客系统，包含展示前台和写作后台。

- **技术栈**：Next.js 14+ (App Router) + React + TypeScript + Tailwind CSS + Shadcn/ui
- **ORM/数据库**：Prisma + SQLite（零配置，个人场景足够，未来可无痛迁移至 PostgreSQL）
- **富文本编辑器**：Tiptap（Headless，基于 ProseMirror，输出 JSON/HTML）
- **认证**：NextAuth.js v5 (Auth.js) Credentials Provider，单用户密码登录
- **部署**：Vercel（推荐）或 Node.js 服务器

---

## 2. 数据库模型（Prisma Schema）

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          String    @default("user") // admin / user
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
}

model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   // Tiptap JSON 或 HTML
  excerpt     String?  // 摘要，自动生成或手动填写
  coverImage  String?  // 封面图 URL
  published   Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  tags        Tag[]    @relation("PostTags")
  views       Int      @default(0)
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique
  posts Post[] @relation("PostTags")
}
```

### 模型说明

| 模型 | 说明 |
|------|------|
| `User` | 用户表，支持单管理员模式，预留多用户扩展 |
| `Post` | 文章/读书笔记主体，存储 Tiptap 富文本内容 |
| `Tag` | 标签，多对多关联 Post |
| `Account` / `Session` | NextAuth.js 所需表 |

---

## 3. 前台（展示端）页面设计

### 路由结构

| 路由 | 页面 | 功能 |
|------|------|------|
| `/` | 首页 | 文章列表、个人简介、最新笔记 |
| `/posts/[slug]` | 文章详情 | 富文本渲染、标签、发布时间、阅读量 |
| `/tags` | 标签云 | 所有标签及文章数量统计 |
| `/tags/[slug]` | 标签归档 | 某标签下的所有文章 |
| `/about` | 关于页面 | 个人介绍、联系方式（可选） |

### 首页（`/`）

**布局**：
- **Header**：博客名称 + 导航链接（首页、标签、关于）+ 搜索入口 + 暗色模式切换
- **Hero Section**：个人头像 + 一句话介绍 + 社交链接
- **文章列表**：卡片式布局，每张卡片展示封面图、标题、摘要、发布日期、标签
- **Footer**：版权信息

**文章卡片**：
- 封面图（可选，无图时展示占位图/纯色背景）
- 标题
- 摘要（自动截取前 150 字）
- 发布日期（`2024年1月15日` 格式）
- 标签列表（可点击跳转标签页）

**交互**：
- 支持暗色/亮色主题切换（`next-themes`）
- 文章列表无限滚动或分页（推荐分页，简单可控）
- 搜索框支持实时搜索（防抖 300ms）

### 文章详情页（`/posts/[slug]`）

**布局**：
- 标题区：大标题 + 发布日期 + 标签 + 阅读量
- 封面图（全宽展示）
- 正文区：富文本渲染（Tiptap 的 `EditorContent` read-only 模式）
- 底部：标签云、返回首页

**富文本渲染支持**：
- 标题（H1-H6）
- 段落、加粗、斜体、删除线
- 有序/无序列表
- 代码块（带语法高亮，`highlight.js` 或 `prismjs`）
- 引用块
- 水平分割线
- 图片（懒加载）
- 超链接

### 标签页（`/tags` & `/tags/[slug]`）

- `/tags`：所有标签按使用频率排序，标签云式展示
- `/tags/[slug]`：该标签下的文章列表，同首页列表样式

---

## 4. 后台（管理端）页面设计

### 路由结构

| 路由 | 页面 | 功能 |
|------|------|------|
| `/admin/login` | 登录页 | 管理员密码登录 |
| `/admin` | 仪表盘 | 文章统计、快捷入口 |
| `/admin/posts` | 文章管理 | 文章列表、搜索、筛选、发布/草稿状态 |
| `/admin/posts/new` | 新建文章 | 富文本编辑器写作 |
| `/admin/posts/[id]/edit` | 编辑文章 | 修改已有文章 |

### 后台布局（`app/admin/layout.tsx`）

- **Sidebar**：导航菜单（仪表盘、文章管理、退出登录）
- **TopBar**：面包屑、当前用户信息
- **Main Content**：页面内容区

### 仪表盘（`/admin`）

- 文章总数统计卡片
- 已发布 / 草稿数量
- 最近 5 篇编辑过的文章快捷列表
- 快捷操作按钮（新建文章）

### 文章管理列表（`/admin/posts`）

- 表格展示：标题、状态（已发布/草稿）、标签、创建时间、更新时间
- 操作列：编辑、删除、预览
- 顶部筛选：按状态筛选（全部/已发布/草稿）、按标签筛选
- 搜索：按标题搜索
- 分页展示

### 文章编辑器（`/admin/posts/new` & `/admin/posts/[id]/edit`）

**表单字段**：
- **标题**：单行文本输入
- **Slug**：自动生成（基于标题），可手动修改，URL 友好格式
- **摘要**：多行文本，可选（留空自动从正文生成）
- **封面图**：图片上传（支持粘贴/拖拽，本地上传至 `/public/uploads` 或转 Base64）
- **标签**：多选/创建标签（输入即创建，逗号分隔）
- **正文**：Tiptap 富文本编辑器
- **状态**：发布 / 草稿 切换

**Tiptap 编辑器工具栏**：
- 撤销/重做
- 标题级别（正文 / H1 / H2 / H3）
- 加粗、斜体、删除线
- 有序列表、无序列表
- 引用块
- 代码块、行内代码
- 超链接插入
- 图片插入（上传或 URL）
- 水平分割线
- 清空格式

**编辑器体验**：
- 自动保存草稿（localStorage，每 30 秒或内容变化时）
- 发布前预览（弹窗或新标签页预览）
- 字符数/字数统计

---

## 5. API 接口设计

### 文章接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| `GET` | `/api/posts` | 文章列表（支持 `page`, `limit`, `search`, `tag`, `published` 参数） | 公开 |
| `GET` | `/api/posts/[slug]` | 文章详情 | 公开 |
| `POST` | `/api/posts` | 创建文章 | 需认证 |
| `PUT` | `/api/posts/[id]` | 更新文章 | 需认证 |
| `DELETE` | `/api/posts/[id]` | 删除文章 | 需认证 |

### 标签接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| `GET` | `/api/tags` | 标签列表（含文章计数） | 公开 |
| `POST` | `/api/tags` | 创建标签 | 需认证 |

### 搜索接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| `GET` | `/api/search?q=关键词` | 全文搜索（标题+内容+摘要） | 公开 |

---

## 6. 项目文件结构

```
reading-blog/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── auth/[...nextauth]/   # NextAuth.js 认证端点
│   │   ├── posts/
│   │   │   ├── route.ts          # POST /api/posts
│   │   │   └── [slug]/
│   │   │       └── route.ts      # GET/PUT/DELETE /api/posts/:slug
│   │   ├── tags/
│   │   │   └── route.ts          # GET/POST /api/tags
│   │   └── search/
│   │       └── route.ts          # GET /api/search
│   ├── (blog)/                   # 前台路由组
│   │   ├── page.tsx              # 首页
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 文章详情
│   │   ├── tags/
│   │   │   ├── page.tsx          # 标签云
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 标签文章列表
│   │   └── about/
│   │       └── page.tsx          # 关于页面
│   ├── admin/                    # 后台路由组
│   │   ├── layout.tsx            # 后台布局（Sidebar + TopBar）
│   │   ├── page.tsx              # 仪表盘
│   │   ├── login/
│   │   │   └── page.tsx          # 登录页
│   │   └── posts/
│   │       ├── page.tsx          # 文章列表
│   │       ├── new/
│   │       │   └── page.tsx      # 新建文章
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx  # 编辑文章
│   ├── layout.tsx                # 根布局
│   ├── globals.css               # 全局样式
│   └── providers.tsx             # 全局 Provider（Theme, Session）
├── components/                   # 公共组件
│   ├── ui/                       # Shadcn/ui 组件
│   ├── blog/                     # 前台专用组件
│   │   ├── Header.tsx
│   │   ├── PostCard.tsx
│   │   ├── PostList.tsx
│   │   ├── TagCloud.tsx
│   │   ├── SearchBox.tsx
│   │   └── ThemeToggle.tsx
│   ├── admin/                    # 后台专用组件
│   │   ├── AdminLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── PostTable.tsx
│   │   └── StatCard.tsx
│   └── editor/                   # 编辑器组件
│       ├── TiptapEditor.tsx      # 核心编辑器
│       ├── EditorToolbar.tsx     # 工具栏
│       └── ContentRender.tsx     # 内容渲染（只读）
├── lib/                          # 工具库
│   ├── prisma.ts                 # Prisma Client 单例
│   ├── auth.ts                   # NextAuth.js 配置
│   ├── utils.ts                  # 通用工具函数
│   └── api.ts                    # API 请求封装
├── prisma/
│   └── schema.prisma             # 数据库模型
├── public/
│   └── uploads/                  # 上传图片存储
├── types/
│   └── index.ts                  # TypeScript 类型定义
├── .env                          # 环境变量
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 7. 依赖清单

### 核心依赖

```json
{
  "next": "^14.x",
  "react": "^18.x",
  "react-dom": "^18.x",
  "typescript": "^5.x"
}
```

### UI & 样式

```bash
# Tailwind CSS + shadcn/ui（通过 npx shadcn@latest init 初始化）
# 所需 shadcn 组件：button, input, textarea, dialog, dropdown-menu, 
#                   badge, card, table, tabs, toast, select, separator
```

### 数据库 & ORM

```json
{
  "prisma": "^5.x",
  "@prisma/client": "^5.x"
}
```

### 认证

```json
{
  "next-auth": "^5.0.0-beta.x"  // Auth.js v5
}
```

### 富文本编辑器（Tiptap）

```json
{
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-image": "^2.x",
  "@tiptap/extension-link": "^2.x",
  "@tiptap/extension-placeholder": "^2.x",
  "@tiptap/extension-underline": "^2.x",
  "@tiptap/extension-code-block-lowlight": "^2.x",
  "lowlight": "^3.x"
}
```

### 其他工具

```json
{
  "next-themes": "^0.x",           // 暗色/亮色主题
  "lucide-react": "^0.x",          // 图标库
  "date-fns": "^3.x",              // 日期格式化
  "clsx": "^2.x",                  // 类名合并
  "tailwind-merge": "^2.x",
  "slugify": "^1.x",               // URL Slug 生成
  "react-hot-toast": "^2.x"        // Toast 提示
}
```

---

## 8. 环境变量配置

```env
# 数据库
DATABASE_URL="file:./dev.db"

# NextAuth.js
AUTH_SECRET="your-random-secret-key"  # 执行 npx auth secret 生成
AUTH_URL="http://localhost:3000"

# 管理员账号（Credentials Provider 使用）
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"

# 博客信息
BLOG_TITLE="我的读书笔记"
BLOG_DESCRIPTION="记录阅读中的思考与收获"
AUTHOR_NAME="你的名字"
```

---

## 9. 关键实现细节

### 9.1 富文本内容存储与渲染

- **存储**：Tiptap 编辑器输出 JSON 格式存储到 `Post.content` 字段，渲染时使用 `generateHTML()` 或 `EditorContent` read-only 模式
- **代码高亮**：使用 `@tiptap/extension-code-block-lowlight` + `lowlight` + `highlight.js` 主题样式
- **图片处理**：上传至 `/public/uploads/`，存储相对路径；生产环境建议使用对象存储

### 9.2 认证流程

- 使用 NextAuth.js v5 (Auth.js) 的 Credentials Provider
- 单用户验证（比对环境变量中的 `ADMIN_EMAIL` 和 `ADMIN_PASSWORD`）
- Session 策略，后台路由通过 `auth()` 检查登录状态
- 未认证用户访问 `/admin/*` 自动重定向到 `/admin/login`

### 9.3 搜索实现

- SQLite 下使用 Prisma 的 `contains` 模糊查询（`title` + `excerpt` + `content`）
- 后期可迁移至 PostgreSQL + 全文搜索

### 9.4 SEO & 性能

- 文章详情页使用 `generateMetadata()` 动态生成标题和描述
- 文章列表使用 ISR 或 SSG（按需生成）
- 图片使用 Next.js `<Image>` 组件优化

---

## 10. 开发阶段规划

### Phase 1：项目初始化
- 初始化 Next.js 项目（TypeScript + Tailwind CSS）
- 配置 shadcn/ui
- 配置 Prisma + SQLite + 数据库模型
- 配置 NextAuth.js 认证

### Phase 2：后台开发
- 搭建后台布局（Sidebar + TopBar）
- 实现文章 CRUD API
- 实现标签管理 API
- 开发文章编辑器页面（Tiptap 集成）
- 开发文章管理列表页

### Phase 3：前台开发
- 搭建前台布局（Header + Footer）
- 开发首页文章列表
- 开发文章详情页（富文本渲染）
- 开发标签相关页面
- 实现搜索功能
- 实现暗色模式

### Phase 4：优化与部署
- 添加 SEO 优化
- 代码块语法高亮
- 响应式适配
- Vercel 部署

---

## 11. 后续可扩展功能（V2 规划）

- [ ] 文章评论系统（Giscus / Disqus / 自研）
- [ ] 阅读数据统计（Plausible / 自研简单统计）
- [ ] RSS 订阅 (`/feed.xml`)
- [ ] 文章系列/专题功能
- [ ] Markdown 导入导出
- [ ] 多用户/多作者支持
- [ ] 数据库迁移至 PostgreSQL（规模扩大时）
