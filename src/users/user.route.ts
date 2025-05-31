import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "./user.controller";
import { adminRoleAuth, bothRolesAuth, userRoleAuth } from "../middleware/bearAuth";

export const userRouter = Router();

// User routes definition


// Get all users
userRouter.get('/users', adminRoleAuth, getUsers);

// Get user by ID
userRouter.get('/users/:id', getUserById);

// Create a new user
userRouter.post('/users', createUser);

// Update an existing user
userRouter.put('/users/:id',updateUser);

// Update an existing user with partial fields
// userRouter.patch('/users/:id', updateUserPartial);

// Delete an existing user
userRouter.delete('/users/:id',adminRoleAuth,deleteUser);