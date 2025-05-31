import { Router } from "express";
import {
  createBook,
  deleteBook,
  getBooks,
  getBookById,
  updateBook,
} from "./book.controller";

import { adminRoleAuth, bothRolesAuth } from "../middleware/bearAuth"; // adjust path if needed

export const bookRouter = Router();

// 📚 Book routes

// Get all books - accessible by admin and member
bookRouter.get("/book", bothRolesAuth, getBooks);

// Get book by ID - accessible by admin and member
bookRouter.get("/book/:id", bothRolesAuth, getBookById);

// Create a new book - only admin
bookRouter.post("/book", adminRoleAuth, createBook);

// Update an existing book - only admin
bookRouter.put("/book/:id", adminRoleAuth, updateBook);

// Delete an existing book - only admin
bookRouter.delete("/book/:id", adminRoleAuth, deleteBook);
