import { Request, Response } from "express";
import {
    createBookServices,
    deleteBookServices,
    getBookByIdServices,
    getBooksServices,
    updateBookServices
} from "./book.service";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { authorTable } from "../drizzle/schema";

export const getBooks = async (req: Request, res: Response) => {
    try {
        const allBooks = await getBooksServices();
        if (!allBooks || allBooks.length === 0) {
            res.status(404).json({ message: "No books found" });
        } else {
            res.status(200).json(allBooks);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch books" });
    }
};

export const getBookById = async (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) {
        res.status(400).json({ error: "Invalid book ID" });
        return;
    }
    try {
        const book = await getBookByIdServices(bookId);
        if (!book) {
            res.status(404).json({ message: "Book not found" });
        } else {
            res.status(200).json(book);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch book" });
    }
};


export const createBook = async (req: Request, res: Response): Promise<void> => {
  const { title, description, authorId, isbn, publicationYear } = req.body;

  if (!title || !authorId) {
    res.status(400).json({ error: "Book title and author ID are required" });
    return;
  }

  try {
    // 🔍 Check if author exists
    const existingAuthor = await db.query.authorTable.findFirst({
      where: eq(authorTable.authorId, authorId),
    });

    if (!existingAuthor) {
      res.status(400).json({ error: "Author not found. Please select a valid author." });
      return;
    }

    // 📚 Create the book
    const newBook = await createBookServices({
      title,
      description,
      authorId,
      isbn,
      publicationYear,
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error("❌ Create Book Error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to create book"
    });
  }
};


export const updateBook = async (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) {
        res.status(400).json({ error: "Invalid book ID" });
        return;
    }
    const { title, description, authorId, isbn, publicationYear } = req.body;
    if (!title || !authorId) {
        res.status(400).json({ error: "Book title and author ID are required" });
        return;
    }
    try {
        const updatedBook = await updateBookServices(bookId, {
            title,
            description,
            authorId,
            isbn,
            publicationYear,
        });
        if (!updatedBook) {
            res.status(404).json({ message: "Book not found or failed to update" });
        } else {
            res.status(200).json(updatedBook);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to update book" });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) {
        res.status(400).json({ error: "Invalid book ID" });
        return;
    }
    try {
        const existingBook = await getBookByIdServices(bookId);
        if (!existingBook) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        const deletedBook = await deleteBookServices(bookId);
        if (deletedBook) {
            res.status(200).json({ message: "Book deleted successfully" });
        } else {
            res.status(404).json({ message: "Book not found or failed to delete" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to delete book" });
    }
};
