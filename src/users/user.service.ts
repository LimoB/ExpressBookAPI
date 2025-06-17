import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TUserInsert, TUserSelect, userTable } from "../drizzle/schema";

// Get all users
export const getUsersServices = async (): Promise<TUserSelect[] | null> => {
  return await db.query.userTable.findMany();
};

// Get user by ID
export const getUserByIdServices = async (userId: string): Promise<TUserSelect | undefined> => {
  return await db.query.userTable.findFirst({
    where: eq(userTable.userId, userId),
  });
};

// Create a new user
export const createUserServices = async (user: TUserInsert): Promise<string> => {
  await db.insert(userTable).values(user).returning();
  return "User Created Successfully 😎";
};

// Update an existing user
export const updateUserServices = async (userId: string, user: TUserInsert): Promise<string> => {
  await db.update(userTable).set(user).where(eq(userTable.userId, userId));
  return "User Updated Successfully 😎";
};

// Delete user
export const deleteUserServices = async (userId: string): Promise<string> => {
  await db.delete(userTable).where(eq(userTable.userId, userId));
  return "User Deleted Successfully";
};
