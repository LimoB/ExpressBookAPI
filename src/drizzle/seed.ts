import db from "./db";
import {
  genreTable,
  authorTable,
  userTable,
  bookTable,
  bookOwnerTable,
} from "./schema";

async function seed() {
  // Insert genres
  const [fiction] = await db
    .insert(genreTable)
    .values({ genreName: "Fiction", genreCode: "FIC" })
    .returning();

  const [nonFiction] = await db
    .insert(genreTable)
    .values({ genreName: "Non-Fiction", genreCode: "NF" })
    .returning();

  // Insert authors
  const [janeAusten] = await db
    .insert(authorTable)
    .values({ authorName: "Jane Austen", genreId: fiction.genreId })
    .returning();

  const [georgeOrwell] = await db
    .insert(authorTable)
    .values({ authorName: "George Orwell", genreId: fiction.genreId })
    .returning();

  const [malcolmGladwell] = await db
    .insert(authorTable)
    .values({ authorName: "Malcolm Gladwell", genreId: nonFiction.genreId })
    .returning();

  // Insert users
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

  // Insert books
  const [pridePrejudice] = await db
    .insert(bookTable)
    .values({
      title: "Pride and Prejudice",  // fixed property name here
      description: "A classic novel about manners and matrimonial machinations.", // optional
      isbn: "9780141439518",
      publicationYear: 1813,
      authorId: janeAusten.authorId,
    })
    .returning();

  const [nineteenEightyFour] = await db
    .insert(bookTable)
    .values({
      title: "1984",  // fixed property name here
      description: "A dystopian novel about totalitarian regime and surveillance.",
      isbn: "9780451524935",
      publicationYear: 1949,
      authorId: georgeOrwell.authorId,
    })
    .returning();

  const [outliers] = await db
    .insert(bookTable)
    .values({
      title: "Outliers",  // fixed property name here
      description: "Examines the factors contributing to high levels of success.",
      isbn: "9780316017930",
      publicationYear: 2008,
      authorId: malcolmGladwell.authorId,
    })
    .returning();

  // Insert book owners
  await db.insert(bookOwnerTable).values({
    bookId: pridePrejudice.bookId,
    ownerId: alice.userId,
  });

  await db.insert(bookOwnerTable).values({
    bookId: nineteenEightyFour.bookId,
    ownerId: bob.userId,
  });

  console.log("✅ Book API Seeding complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Book API Seeding failed:", e);
  process.exit(1);
});
