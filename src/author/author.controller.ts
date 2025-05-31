// src/author/author.controller.ts
import { Request, Response } from "express";
import {
  createAuthorService,
  deleteAuthorService,
  getAuthorByIdService,
  getAuthorsService,
  createAuthorWithBookService,
  updateAuthorService,
} from "./author.service";

export const getAllAuthors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const authors = await getAuthorsService();
    if (!authors || authors.length === 0) {
      res.status(404).json({ message: "No authors found" });
      return;
    }
    res.status(200).json(authors);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch authors" });
  }
};

export const getAuthorById = async (req: Request, res: Response): Promise<void> => {
  const authorId = parseInt(req.params.id);
  if (isNaN(authorId)) {
    res.status(400).json({ error: "Invalid author ID" });
    return;
  }
  try {
    const author = await getAuthorByIdService(authorId);
    if (!author) {
      res.status(404).json({ message: "Author not found" });
      return;
    }
    res.status(200).json(author);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch author" });
  }
};

export const createAuthor = async (req: Request, res: Response): Promise<void> => {
  const { authorName, genreId } = req.body;

  if (!authorName || typeof genreId !== "number") {
    res.status(400).json({ error: "Both authorName and genreId are required and genreId must be a number" });
    return;
  }

  try {
    const message = await createAuthorService({ authorName, genreId });
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create author" });
  }
};

export const updateAuthor = async (req: Request, res: Response): Promise<void> => {
  const authorId = parseInt(req.params.id);
  if (isNaN(authorId)) {
    res.status(400).json({ error: "Invalid author ID" });
    return;
  }

  const { authorName, genreId } = req.body;
  if (!authorName || typeof genreId !== "number") {
    res.status(400).json({ error: "Both authorName and genreId are required and genreId must be a number" });
    return;
  }

  try {
    const message = await updateAuthorService(authorId, { authorName, genreId });
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update author" });
  }
};

export const deleteAuthor = async (req: Request, res: Response): Promise<void> => {
  const authorId = parseInt(req.params.id);
  if (isNaN(authorId)) {
    res.status(400).json({ error: "Invalid author ID" });
    return;
  }

  try {
    const message = await deleteAuthorService(authorId);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete author" });
  }
};



export const createAuthorWithBook = async (req: Request, res: Response): Promise<void> => {
  const { authorName, genreId, book } = req.body;
  const ownerIdString = req.user?.userId;

  if (!ownerIdString) {
    res.status(401).json({ error: "Unauthorized: User must be logged in" });
    return;
  }

  // Convert ownerId to number
  const ownerId = Number(ownerIdString);
  if (isNaN(ownerId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  if (!authorName || typeof genreId !== "number" || !book?.title) {
    res.status(400).json({ error: "authorName, genreId, and book.title are required" });
    return;
  }

  try {
    const message = await createAuthorWithBookService({ authorName, genreId }, book, ownerId);
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create author and book" });
  }
};
