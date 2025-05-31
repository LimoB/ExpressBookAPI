import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

type DecodedToken = {
  userId: string;
  email: string;
  userType: string;
  exp?: number;
};

// Helper: Verify token
export const verifyToken = async (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as DecodedToken;
  } catch {
    return null;
  }
};

// Helper: Async middleware wrapper to catch errors
const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Factory: Role-based middleware
export const createRoleAuth = (requiredRole: string): RequestHandler =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authorization header missing or malformed" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await verifyToken(token, process.env.JWT_SECRET as string);
    if (!decodedToken) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const userType = decodedToken.userType;
    if (
      (requiredRole === "both" && (userType === "admin" || userType === "member")) ||
      userType === requiredRole
    ) {
      req.user = decodedToken;
      return next();
    }

    res.status(403).json({ error: "Forbidden: insufficient privileges" });
  });

// Ready-to-use middlewares
export const adminRoleAuth = createRoleAuth("admin");
export const userRoleAuth = createRoleAuth("member");
export const bothRolesAuth = createRoleAuth("both");
