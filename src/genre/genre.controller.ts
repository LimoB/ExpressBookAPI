import { Request, Response } from "express";
import {
  createGenreService,
  deleteGenreService,
  getAllGenresService,
  getGenreByIdService,
  updateGenreService,
} from "./genre.service";

export const getGenres = async (_req: Request, res: Response) => {
  try {
    const genres = await getAllGenresService();
    if (!genres || genres.length === 0) {
      res.status(404).json({ message: "No genres found" });
    } else {
      res.status(200).json(genres);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch genres" });
  }
};

export const getGenreById = async (req: Request, res: Response) => {
  const genreId = parseInt(req.params.id);
  if (isNaN(genreId)) {
    res.status(400).json({ error: "Invalid genre ID" });
    return;
  }

  try {
    const genre = await getGenreByIdService(genreId);
    if (!genre) {
      res.status(404).json({ message: "Genre not found" });
    } else {
      res.status(200).json(genre);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch genre" });
  }
};

export const createGenre = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: "Genre name is required" });
    return;
  }

  try {
    const genre = await createGenreService(name);
    res.status(201).json(genre);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create genre" });
  }
};

export const updateGenre = async (req: Request, res: Response) => {
  const genreId = parseInt(req.params.id);
  const { name } = req.body;

  if (isNaN(genreId)) {
    res.status(400).json({ error: "Invalid genre ID" });
    return;
  }

  if (!name) {
    res.status(400).json({ error: "Genre name is required" });
    return;
  }

  try {
    const updated = await updateGenreService(genreId, name);
    if (!updated) {
      res.status(404).json({ message: "Genre not found or failed to update" });
    } else {
      res.status(200).json(updated);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update genre" });
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  const genreId = parseInt(req.params.id);
  if (isNaN(genreId)) {
    res.status(400).json({ error: "Invalid genre ID" });
    return;
  }

  try {
    const deleted = await deleteGenreService(genreId);
    if (deleted) {
      res.status(200).json({ message: "Genre deleted successfully" });
    } else {
      res.status(404).json({ message: "Genre not found or failed to delete" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete genre" });
  }
};
