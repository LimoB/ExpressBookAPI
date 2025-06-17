import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid"; // ✅ Import UUID generator
import {
  createUserServices,
  getUserByEmailIdServices,
} from "./auth.service";

// 📌 Register Logic
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      fullName,
      email,
      password,
      userType,
    }: {
      fullName: string;
      email: string;
      password: string;
      userType?: string;
    } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // 🔒 Validate userType
    let validatedUserType: "admin" | "member" | "author" | undefined;
    const allowedRoles = ["admin", "member", "author"];
    if (userType && allowedRoles.includes(userType)) {
      validatedUserType = userType as "admin" | "member" | "author";
    } else if (userType !== undefined) {
      res.status(400).json({
        error: "Invalid userType. Must be 'admin', 'member', or 'author'.",
      });
      return;
    }

    // 🔑 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🧱 Prepare user object
    const userToCreate = {
      userId: uuidv4(), // ✅ Correct usage
      fullName,
      email,
      password: hashedPassword,
      userType: validatedUserType,
    };

    const newUser = await createUserServices(userToCreate);

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// 🔐 Login Logic
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const existingUser = await getUserByEmailIdServices(email);
    if (!existingUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const payload = {
      userId: existingUser.userId,
      email: existingUser.email,
      fullName: existingUser.fullName,
      userType: existingUser.userType,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment");
    }

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: existingUser.userId,
        email: existingUser.email,
        fullName: existingUser.fullName,
        userType: existingUser.userType,
      },
    });
  } catch (error) {
    next(error);
  }
};
