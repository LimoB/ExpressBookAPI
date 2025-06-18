import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  authorTable,
  genreTable,
  bookTable,
  bookOwnerTable,
  TAuthorInsert
} from "../drizzle/schema";

// ✅ Get all authors with their genre and books
export const getAuthorsService = async (): Promise<any[]> => {
  const authors = await db
    .select()
    .from(authorTable)
    .leftJoin(genreTable, eq(authorTable.genreId, genreTable.genreId))
    .leftJoin(bookTable, eq(authorTable.authorId, bookTable.authorId));

  const grouped = new Map<number, any>();

  for (const row of authors) {
    const a = row.author;
    const g = row.genre;
    const b = row.book;

    if (!grouped.has(a.authorId)) {
      grouped.set(a.authorId, {
        ...a,
        genre: g ? { genreName: g.genreName } : null,
        books: [],
      });
    }

    if (b?.bookId) {
      grouped.get(a.authorId).books.push({
        bookId: b.bookId,
        title: b.title,
        description: b.description,
        isbn: b.isbn,
        publicationYear: b.publicationYear,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      });
    }
  }

  return Array.from(grouped.values());
};

// ✅ Get one author by ID
export const getAuthorByIdService = async (authorId: number): Promise<any | null> => {
  const authors = await db
    .select()
    .from(authorTable)
    .leftJoin(genreTable, eq(authorTable.genreId, genreTable.genreId))
    .leftJoin(bookTable, eq(authorTable.authorId, bookTable.authorId))
    .where(eq(authorTable.authorId, authorId));

  if (authors.length === 0) return null;

  const a = authors[0].author;
  const g = authors[0].genre;

  const books = authors
    .filter(r => r.book && r.book.bookId !== undefined)
    .map(r => {
      const book = r.book!;
      return {
        bookId: book.bookId,
        title: book.title,
        description: book.description,
        isbn: book.isbn,
        publicationYear: book.publicationYear,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      };
    });

  return {
    ...a,
    genre: g ? { genreName: g.genreName } : null,
    books,
  };
};


// ✅ Create a new author
export const createAuthorService = async (authorData: TAuthorInsert): Promise<string> => {
  await db.insert(authorTable).values(authorData);
  return "Author created successfully ✍️📚";
};

// ✅ Update an existing author
export const updateAuthorService = async (
  authorId: number,
  authorData: Partial<TAuthorInsert>
): Promise<string> => {
  await db.update(authorTable).set(authorData).where(eq(authorTable.authorId, authorId));
  return "Author updated successfully ✍️😎";
};

// ✅ Delete an author
export const deleteAuthorService = async (authorId: number): Promise<string> => {
  await db.delete(authorTable).where(eq(authorTable.authorId, authorId));
  return "Author deleted successfully ✍️🗑️";
};
// ✅ Create author + book + ownership
export const createAuthorWithBookService = async (
  authorData: TAuthorInsert,
  bookData: BookInput,
  ownerId: string // 🔁 changed from number to string
): Promise<string> => {
  const insertedAuthors = await db.insert(authorTable).values(authorData).returning({ authorId: authorTable.authorId });
  const newAuthorId = insertedAuthors[0]?.authorId;
  if (!newAuthorId) throw new Error("Author creation failed");

  const insertedBooks = await db.insert(bookTable).values({
    ...bookData,
    authorId: newAuthorId,
  }).returning({ bookId: bookTable.bookId });

  const newBookId = insertedBooks[0]?.bookId;
  if (!newBookId) throw new Error("Book creation failed");

  await db.insert(bookOwnerTable).values({
    bookId: newBookId,
    ownerId: ownerId, // 🔁 explicitly string
  });

  return "Author, book, and ownership created successfully 📚✅";
};

// 👇 Types
interface BookInput {
  title: string;
  description?: string;
  isbn?: string;
  publicationYear?: number;
}
