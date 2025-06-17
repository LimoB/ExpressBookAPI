import { Router } from "express";
import {
  adminOnly,       // ✔️ Only admins
  allRoles         // ✔️ All roles: admin, member, author
} from "../middleware/bearAuth";

import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  createAuthorWithBook,
  deleteAuthor,
} from "./author.controller";

export const authorRouter = Router();

// GET all authors - accessible by all roles
authorRouter.get("/authors", allRoles, getAllAuthors);

// GET author by ID - accessible by all roles
authorRouter.get("/authors/:id", allRoles, getAuthorById);

// POST create new author - admin only
authorRouter.post("/authors", adminOnly, createAuthor);

// POST create author with book - admin only
authorRouter.post("/author-with-book", adminOnly, createAuthorWithBook);

// PUT update author by ID - admin only
authorRouter.put("/authors/:id", adminOnly, updateAuthor);

// DELETE author by ID - admin only
authorRouter.delete("/authors/:id", adminOnly, deleteAuthor);
