import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { bookOwnerTable, bookTable } from "../drizzle/schema";
import { author } from "../drizzle/schema";

// Get all authors with their genre info and books
export const getAuthorsService = async (): Promise<any[] | null> => {
  return await db.query.author.findMany({
    with: {
      genre: {
        columns: {
          genreName: true,
        },
      },
      books: {
        columns: {
          bookId: true,
          title: true,
          description: true,
          isbn: true,
          publicationYear: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
};

// Get one author by ID with their genre info and books
export const getAuthorByIdService = async (authorId: number): Promise<any | undefined> => {
  return await db.query.author.findFirst({
    where: eq(author.authorId, authorId),
    with: {
      genre: {
        columns: {
          genreName: true,
        },
      },
      books: {
        columns: {
          bookId: true,
          title: true,
          description: true,
          isbn: true,
          publicationYear: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
};

// Create a new author
export const createAuthorService = async (authorData: TAuthorInsert): Promise<string> => {
  await db.insert(author).values(authorData).returning();
  return "Author created successfully ✍️📚";
};

// Update an existing author
export const updateAuthorService = async (
  authorId: number,
  authorData: Partial<TAuthorInsert>
): Promise<string> => {
  await db.update(author)
    .set(authorData)
    .where(eq(author.authorId, authorId));
  return "Author updated successfully ✍️😎";
};

// Delete an author
export const deleteAuthorService = async (authorId: number): Promise<string> => {
  await db.delete(author)
    .where(eq(author.authorId, authorId));
  return "Author deleted successfully ✍️🗑️";
};



type TAuthorInsert = {
  authorName: string;
  genreId: number;
};

interface BookInput {
  title: string;
  description?: string;
  isbn?: string;
  publicationYear?: number;
}

export const createAuthorWithBookService = async (
  authorData: TAuthorInsert,
  bookData: BookInput,
  ownerId: number
): Promise<string> => {
  // Insert author
  const insertedAuthors = await db.insert(author).values(authorData).returning({ authorId: author.authorId });
  const newAuthorId = insertedAuthors[0]?.authorId;
  if (!newAuthorId) throw new Error("Author creation failed");

  // Insert book with authorId
  const insertedBooks = await db.insert(bookTable).values({
    ...bookData,
    authorId: newAuthorId,
  }).returning({ bookId: bookTable.bookId });

  const newBookId = insertedBooks[0]?.bookId;
  if (!newBookId) throw new Error("Book creation failed");

  // Insert ownership record
  await db.insert(bookOwnerTable).values({
    bookId: newBookId,
    ownerId,
  });

  return "Author, book, and ownership created successfully 📚✅";
};
