import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { bookTable, TBookInsert, TBookSelect } from "../drizzle/schema";

// Get all books with related data
export const getBooksServices = async (): Promise<TBookSelect[] | null> => {
  return await db.query.bookTable.findMany({
    with: {
      author: {
        columns: {
          authorName: true,
        },
        with: {
          genre: {
            columns: {
              genreName: true,
            },
          },
        },
      },
      owners: {
        with: {
          user: {
            columns: {
              fullName: true,
              email: true,
              userType: true,
            },
          },
        },
      },
    },
  });
};

// Get single book by ID
export const getBookByIdServices = async (bookId: number): Promise<TBookSelect | undefined> => {
  return await db.query.bookTable.findFirst({
    where: eq(bookTable.bookId, bookId),
    with: {
      author: {
        columns: {
          authorName: true,
        },
        with: {
          genre: {
            columns: {
              genreName: true,
            },
          },
        },
      },
      owners: {
        with: {
          user: {
            columns: {
              fullName: true,
              email: true,
              userType: true,
            },
          },
        },
      },
    },
  });
};

// Create a new book
export const createBookServices = async (book: TBookInsert): Promise<TBookSelect | null> => {
  const inserted = await db.insert(bookTable).values(book).returning();
  return inserted[0] || null;
};

// Update an existing book
export const updateBookServices = async (
  bookId: number,
  book: Partial<TBookInsert>
): Promise<TBookSelect | null> => {
  const updated = await db
    .update(bookTable)
    .set(book)
    .where(eq(bookTable.bookId, bookId))
    .returning();
  return updated[0] || null;
};

// Delete a book
export const deleteBookServices = async (bookId: number): Promise<boolean> => {
  const deleted = await db.delete(bookTable).where(eq(bookTable.bookId, bookId)).returning();
  return deleted.length > 0;
};
