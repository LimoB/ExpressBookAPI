import { Router } from "express";
import {
  createBook,
  deleteBook,
  getBooks,
  getBookById,
  updateBook,
} from "./book.controller";

import { adminOnly, adminOrMember } from "../middleware/bearAuth";

export const bookRouter = Router();

// 📚 Book routes

// Get all books - accessible by admin and member
bookRouter.get("/book", adminOrMember, getBooks);

// Get book by ID - accessible by admin and member
bookRouter.get("/book/:id", adminOrMember, getBookById);

// Create a new book - only admin
bookRouter.post("/book", adminOnly, createBook);

// Update an existing book - only admin
bookRouter.put("/book/:id", adminOnly, updateBook);

// Delete an existing book - only admin
bookRouter.delete("/book/:id", adminOnly, deleteBook);
