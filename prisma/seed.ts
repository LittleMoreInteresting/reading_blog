import { PrismaClient } from "@prisma/client";
import { books, notes } from "../lib/data";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Create admin user first
  const admin = await prisma.user.upsert({
    where: { email: "admin@reading.blog" },
    update: {},
    create: {
      email: "admin@reading.blog",
      name: "Admin",
      role: "admin",
    },
  });

  console.log(`Created admin user: ${admin.email}`);

  // Create books and their notes
  for (const bookData of books) {
    const book = await prisma.book.create({
      data: {
        title: bookData.title,
        author: bookData.author,
        slug: bookData.id,
        coverColor: bookData.coverColor,
        spineColor: bookData.spineColor,
        emoji: bookData.emoji,
        description: bookData.description,
        userId: admin.id,
      },
    });

    console.log(`Created book: ${book.title}`);

    const bookNotes = notes[bookData.id] || [];
    for (const noteData of bookNotes) {
      const tags = noteData.tags.map((tagName) => ({
        where: { slug: tagName },
        create: { name: tagName, slug: tagName },
      }));

      await prisma.post.create({
        data: {
          title: noteData.title,
          slug: noteData.id,
          content: JSON.stringify({
            type: "doc",
            content: noteData.content.split("\n\n").map((paragraph) => ({
              type: "paragraph",
              content: [{ type: "text", text: paragraph }],
            })),
          }),
          excerpt: noteData.content.slice(0, 150) + "...",
          published: true,
          publishedAt: new Date(noteData.createdAt),
          authorId: admin.id,
          bookId: book.id,
          pageNumber: noteData.pageNumber,
          tags: {
            connectOrCreate: tags,
          },
        },
      });

      console.log(`  Created note: ${noteData.title}`);
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
