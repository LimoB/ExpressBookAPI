// // routes/authorRoutes.ts
// import express from "express";
// import { Author } from "../models"; // Adjust this based on your ORM setup

// const router = express.Router();

// // GET /api/authors
// router.get("/", async (req, res) => {
//   try {
//     const authors = await Author.findAll(); // Sequelize
//     res.json(authors);
//   } catch (err) {
//     console.error("Error fetching authors:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// export default router;
