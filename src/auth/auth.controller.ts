import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUserServices, getUserByEmailIdServices } from "./auth.service";

// Register Logic
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: { fullName: string; email: string; password: string; userType?: string } = req.body;

    // Validate required fields
    if (!user.fullName || !user.email || !user.password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // Validate userType if provided
    let validatedUserType: "admin" | "member" | undefined = undefined;
    if (user.userType) {
      if (user.userType === "admin" || user.userType === "member") {
        validatedUserType = user.userType;
      } else {
        res.status(400).json({ error: "Invalid userType. Must be 'admin' or 'member'." });
        return;
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);





    // Final user object
    const userToCreate = {
      fullName: user.fullName,
      email: user.email,
      password: hashedPassword,
      userType: validatedUserType,
    };

    const newUser = await createUserServices(userToCreate);
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error: any) {
    res.status(500).json({ error: "Error creating user" });
  }
};

// Login Logic
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const existingUser = await getUserByEmailIdServices(email);
    if (!existingUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Use async bcrypt compare
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }


    
    // Generate JWT token
    const payload = {
      userId: existingUser.userId,
      email: existingUser.email,
      fullName: existingUser.fullName,
      userType: existingUser.userType,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // expires in 1 hour
    };

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign(payload, secret);

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
    res.status(500).json({ error: "Login failed" });
  }
};
