import db from "./db"; // make sure your Drizzle db client is imported properly
import {
  userTable,
  genreTable,
  authorTable,
  authorGenreTable,
  bookTable,
  bookOwnerTable
} from "./schema";

async function seed() {
  try {
    console.log("🧹 Clearing existing data...");

    // Clear all data (respect foreign key constraints order)
    await db.delete(bookOwnerTable);
    await db.delete(bookTable);
    await db.delete(authorGenreTable);
    await db.delete(authorTable);
    await db.delete(genreTable);
    await db.delete(userTable);

    console.log("🌱 Inserting seed data...");

    // 🧑‍💼 Users
    const [admin, member] = await db
      .insert(userTable)
      .values([
        {
          userId: "user-1",
          fullName: "Admin User",
          email: "admin@example.com",
          password: "hashedpassword1", // hash your passwords in real apps
          userType: "admin"
        },
        {
          userId: "user-2",
          fullName: "Regular Member",
          email: "member@example.com",
          password: "hashedpassword2",
          userType: "member"
        }
      ])
      .returning();

    // 🎵 Genres
    const [fiction, science] = await db
      .insert(genreTable)
      .values([
        { genreName: "Fiction", genreCode: "FIC" },
        { genreName: "Science", genreCode: "SCI" }
      ])
      .returning();

    // ✍️ Authors
    const [author1, author2] = await db
      .insert(authorTable)
      .values([
        { authorName: "Jane Doe", genreId: fiction.genreId },
        { authorName: "Albert Einstein", genreId: science.genreId }
      ])
      .returning();

    // 🔗 Author-Genre Mapping
    await db.insert(authorGenreTable).values([
      { authorId: author1.authorId, genreId: fiction.genreId },
      { authorId: author2.authorId, genreId: science.genreId }
    ]);

    // 📚 Books
    const [book1, book2, book3, book4, book5, book6] = await db
      .insert(bookTable)
      .values([
        {
          title: "A Tale of Two Codes",
          description: "A fiction novel about programming.",
          isbn: "111-222-333",
          publicationYear: 2021,
          authorId: author1.authorId
        },
        {
          title: "Relativity for Beginners",
          description: "Introductory guide to Einstein's theory.",
          isbn: "444-555-666",
          publicationYear: 2020,
          authorId: author2.authorId
        },
        {
          title: "Code & Prejudice",
          description: "A classic love story in a digital world.",
          isbn: "777-888-999",
          publicationYear: 2022,
          authorId: author1.authorId
        },
        {
          title: "Quantum Quirks",
          description: "Exploring the quirks of quantum mechanics.",
          isbn: "000-111-222",
          publicationYear: 2019,
          authorId: author2.authorId
        },
        {
          title: "The Algorithmic Heart",
          description: "Romance in the age of artificial intelligence.",
          isbn: "333-444-555",
          publicationYear: 2023,
          authorId: author1.authorId
        },
        {
          title: "The Cosmic Clock",
          description: "Understanding time and space.",
          isbn: "666-777-888",
          publicationYear: 2018,
          authorId: author2.authorId
        }
      ])
      .returning();

    // 👤 Book Ownership
    await db.insert(bookOwnerTable).values([
      { bookId: book1.bookId, ownerId: admin.userId },
      { bookId: book2.bookId, ownerId: member.userId },
      { bookId: book3.bookId, ownerId: member.userId },
      { bookId: book4.bookId, ownerId: admin.userId },
      { bookId: book5.bookId, ownerId: admin.userId },
      { bookId: book6.bookId, ownerId: member.userId }
    ]);

    console.log("✅ Seed completed successfully");
  } catch (err) {
    console.error("❌ Seed failed", err);
  }
}

seed();
