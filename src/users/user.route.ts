import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser
} from "./user.controller";

import {
  adminOnly,
  memberOnly,
  adminOrMember
} from "../middleware/bearAuth"; // ⬅️ Make sure names match your middleware export

export const userRouter = Router();

// 🔐 Admin-only: Get all users
userRouter.get("/users", adminOnly, getUsers);

// 🔓 Public or authenticated: Get user by ID (optional: protect with auth)
userRouter.get("/users/:id", getUserById);

// 🔓 Public: Create a new user
userRouter.post("/users", createUser);

// 🔐 Member or Admin: Update a user (self or others, handled in controller)
userRouter.put("/users/:id", adminOrMember, updateUser);

// 🔐 Admin-only: Delete a user
userRouter.delete("/users/:id", adminOnly, deleteUser);

// 🧩 Optional future support for PATCH
// userRouter.patch("/users/:id", adminOrMember, updateUserPartial);
