import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { bookTable, TBookInsert, TBookSelect } from "../drizzle/schema";

// CRUD Operations for Book entity

// Get all books
export const getBooksServices = async (): Promise<any[] | null> => {
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
                            userType: true,  // Added userType here
                        },
                    },
                },
            },
        },
    });
};

// Get book by ID
export const getBookByIdServices = async (bookId: number): Promise<any | undefined> => {
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
                            userType: true,  // Added userType here too
                        },
                    },
                },
            },
        },
    });
};

// Create a new book
export const createBookServices = async (book: TBookInsert): Promise<string> => {
    await db.insert(bookTable).values(book).returning();
    return "Book created successfully 📚🎉";
};

// Update an existing book
export const updateBookServices = async (bookId: number, book: Partial<TBookInsert>): Promise<string> => {
    await db.update(bookTable).set(book).where(eq(bookTable.bookId, bookId));
    return "Book updated successfully 📚😎";
};

// Delete a book
export const deleteBookServices = async (bookId: number): Promise<string> => {
    await db.delete(bookTable).where(eq(bookTable.bookId, bookId));
    return "Book deleted successfully 📚🎉";
};
