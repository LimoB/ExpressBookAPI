import { Router } from "express";
import { adminRoleAuth, userRoleAuth } from "../middleware/bearAuth";
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  createAuthorWithBook,
  deleteAuthor,
} from "./author.controller";

export const authorRouter = Router();

// GET all authors
authorRouter.get("/authors", getAllAuthors);

// GET author by ID
authorRouter.get("/authors/:id", getAuthorById);

// POST create new author
authorRouter.post("/authors", createAuthor);

//post create author with book
authorRouter.post("/author-with-book", adminRoleAuth, createAuthorWithBook);



// PUT update author by ID
authorRouter.put("/authors/:id", updateAuthor);

// DELETE author by ID
authorRouter.delete("/authors/:id", deleteAuthor);
