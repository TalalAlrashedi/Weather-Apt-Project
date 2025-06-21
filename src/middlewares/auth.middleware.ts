import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: { code: "NO_TOKEN", message: "Authorization token is missing" },
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: { code: "INVALID_TOKEN", message: "JWT expired or malformed." },
    });
  }
};