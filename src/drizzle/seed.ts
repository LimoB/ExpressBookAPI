import db from "./db";
import {
  genreTable,
  author,
  userTable,
  bookTable,
  bookOwnerTable,
} from "./schema";
import { sql } from "drizzle-orm"; // Needed for raw SQL

async function seed() {
  // Step 1: Clean existing data
  await db.execute(`DELETE FROM "bookOwnerTable"`);
  await db.execute(`DELETE FROM "bookTable"`);
  await db.execute(`DELETE FROM "authorGenreTable"`);
  await db.execute(`DELETE FROM "author"`);           // Note: your table name is "author"
  await db.execute(`DELETE FROM "genreTable"`);
  await db.execute(`DELETE FROM "userTable"`);

  // Optional: Reset primary key sequences (adjust sequence names to your DB)
  await db.execute(sql`ALTER SEQUENCE "genreTable_genreId_seq" RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE "author_author_id_seq" RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE "userTable_userId_seq" RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE "bookTable_bookId_seq" RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE "bookOwnerTable_bookOwnerId_seq" RESTART WITH 1`);

  // Step 2: Seed fresh data
  const [fiction] = await db
    .insert(genreTable)
    .values({ genreName: "Fiction", genreCode: "FIC" })
    .returning();

  const [nonFiction] = await db
    .insert(genreTable)
    .values({ genreName: "Non-Fiction", genreCode: "NF" })
    .returning();

  const [mystery] = await db
    .insert(genreTable)
    .values({ genreName: "Mystery", genreCode: "MYS" })
    .returning();

  const [janeAusten] = await db
    .insert(author)
    .values({ authorName: "Jane Austen", genreId: fiction.genreId })
    .returning();

  const [georgeOrwell] = await db
    .insert(author)
    .values({ authorName: "George Orwell", genreId: fiction.genreId })
    .returning();

  const [agathaChristie] = await db
    .insert(author)
    .values({ authorName: "Agatha Christie", genreId: mystery.genreId })
    .returning();

  const [alice] = await db
    .insert(userTable)
    .values({
      fullName: "Alice Smith",
      email: "alice@example.com",
      password: "password1",
      userType: "admin",
    })
    .returning();

  const [bob] = await db
    .insert(userTable)
    .values({
      fullName: "Bob Jones",
      email: "bob@example.com",
      password: "password2",
      userType: "member",
    })
    .returning();

  const [charlie] = await db
    .insert(userTable)
    .values({
      fullName: "Charlie Brown",
      email: "charlie@example.com",
      password: "password3",
      userType: "member",
    })
    .returning();

  const [pridePrejudice] = await db
    .insert(bookTable)
    .values({
      title: "Pride and Prejudice",
      description: "A classic novel about manners and matrimonial machinations.",
      isbn: "9780141439518",
      publicationYear: 1813,
      authorId: janeAusten.authorId,
    })
    .returning();

  const [nineteenEightyFour] = await db
    .insert(bookTable)
    .values({
      title: "1984",
      description: "A dystopian novel about a totalitarian regime and surveillance.",
      isbn: "9780451524935",
      publicationYear: 1949,
      authorId: georgeOrwell.authorId,
    })
    .returning();

  const [murderOrientExpress] = await db
    .insert(bookTable)
    .values({
      title: "Murder on the Orient Express",
      description: "A detective novel featuring Hercule Poirot.",
      isbn: "9780062693662",
      publicationYear: 1934,
      authorId: agathaChristie.authorId,
    })
    .returning();

  await db.insert(bookOwnerTable).values([
    { bookId: pridePrejudice.bookId, ownerId: alice.userId },
    { bookId: nineteenEightyFour.bookId, ownerId: bob.userId },
    { bookId: murderOrientExpress.bookId, ownerId: charlie.userId },
  ]);

  console.log("✅ Book API Seeding complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Book API Seeding failed:", e);
  process.exit(1);
});
