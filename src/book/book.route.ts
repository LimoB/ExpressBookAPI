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
bookRouter.get("/book", getBooks);   // bothRolesAuth,

// Get book by ID - accessible by admin and member
bookRouter.get("/book/:id", getBookById);  // bothRolesAuth,

// Create a new book - only admin
bookRouter.post("/book", createBook); // adminRoleAuth,

// Update an existing book - only admin
bookRouter.put("/book/:id", updateBook); // adminRoleAuth,

// Delete an existing book - only admin
bookRouter.delete("/book/:id", deleteBook); //adminRoleAuth,
