import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

// 🔒 Allowed roles in the system (extend as needed)
type Role = "admin" | "member" | "author";

// 📦 Token payload type
type DecodedToken = {
  userId: string;
  email: string;
  userType: Role;
  exp?: number;
};

// 🛡 Extend Express request with `user`
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

// 🔐 Helper: Verify JWT token and return payload
export const verifyToken = async (
  token: string,
  secret: string
): Promise<DecodedToken | null> => {
  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "object" && "userType" in decoded) {
      return decoded as DecodedToken;
    }
    return null;
  } catch {
    return null;
  }
};

// ⚙️ Async wrapper to avoid repetitive try/catch
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

// 🏁 Main Middleware Factory: Accepts one or more allowed roles
export const createRoleAuth = (allowedRoles: Role[]): RequestHandler =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authorization header missing or malformed" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await verifyToken(token, process.env.JWT_SECRET as string);

    if (!decodedToken) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    if (!allowedRoles.includes(decodedToken.userType)) {
      res.status(403).json({ error: "Forbidden: insufficient privileges" });
      return;
    }

    req.user = decodedToken;
    next();
  });

// ✅ Predefined Middleware Variants
export const adminOnly = createRoleAuth(["admin"]);
export const memberOnly = createRoleAuth(["member"]);
export const authorOnly = createRoleAuth(["author"]);
export const adminOrMember = createRoleAuth(["admin", "member"]);
export const allRoles = createRoleAuth(["admin", "member", "author"]);
