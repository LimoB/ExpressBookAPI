import { Router } from "express";
import {
  getGenres,        // <-- change this
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
} from "./genre.controller";

export const genreRouter = Router();

// GET all genres
genreRouter.get("/genres", getGenres);  // <-- change this too

// GET genre by ID
genreRouter.get("/genres/:id", getGenreById);

// POST create new genre
genreRouter.post("/genres", createGenre);

// PUT update genre by ID
genreRouter.put("/genres/:id", updateGenre);

// DELETE genre by ID
genreRouter.delete("/genres/:id", deleteGenre);
