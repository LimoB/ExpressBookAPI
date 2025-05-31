import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { genreTable, TGenreSelect } from "../drizzle/schema";

// Get all genres with their authors and books included
export const getAllGenresService = async (): Promise<(TGenreSelect & { authors?: (any & { books?: any[] })[] })[] | null> => {
  return await db.query.genreTable.findMany({
    with: {
      authors: {
        columns: {
          authorId: true,
          authorName: true,
          createdAt: true,
          updatedAt: true,
          genreId: true,
        },
        with: {
          books: {
            columns: {
              bookId: true,
              title: true,
              description: true,
              isbn: true,
              publicationYear: true,
              authorId: true,
              createdAt: true,
              updatedAt: true,
            }
          }
        }
      },
    },
  });
};

// Get genre by ID with authors and books included
export const getGenreByIdService = async (genreId: number): Promise<(TGenreSelect & { authors?: (any & { books?: any[] })[] }) | undefined> => {
  return await db.query.genreTable.findFirst({
    where: eq(genreTable.genreId, genreId),
    with: {
      authors: {
        columns: {
          authorId: true,
          authorName: true,
          createdAt: true,
          updatedAt: true,
          genreId: true,
        },
        with: {
          books: {
            columns: {
              bookId: true,
              title: true,
              description: true,
              isbn: true,
              publicationYear: true,
              authorId: true,
              createdAt: true,
              updatedAt: true,
            }
          }
        }
      },
    },
  });
};

// Create a new genre
export const createGenreService = async (name: string): Promise<string> => {
  await db.insert(genreTable).values({ genreName: name });
  return "Genre created successfully 🎶✨";
};

// Update a genre
export const updateGenreService = async (genreId: number, name: string): Promise<string> => {
  await db.update(genreTable).set({ genreName: name }).where(eq(genreTable.genreId, genreId));
  return "Genre updated successfully 🎨🛠️";
};

// Delete a genre
export const deleteGenreService = async (genreId: number): Promise<string> => {
  await db.delete(genreTable).where(eq(genreTable.genreId, genreId));
  return "Genre deleted successfully 🗑️";
};
