import express, { Application, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ Import CORS
import { logger } from "./middleware/logger";
import { userRouter } from "./users/user.route";
import { genreRouter } from "./genre/genre.route";
import { authorRouter } from "./author/author.route";
import { bookRouter } from "./book/book.route";
import { authRouter } from "./auth/auth.route";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ✅ Setup CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend dev server
    credentials: true, // Allow cookies or auth headers if needed
  })
);

// Basic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Default route
app.get("/", (_req, res: Response) => {
  res.send("📚 Welcome to Book API Backend with Drizzle ORM and PostgreSQL");
});

// Mount API routes
app.use("/api", userRouter);
app.use("/api", genreRouter);
app.use("/api", authorRouter);
app.use("/api", bookRouter);
app.use("/api", authRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
