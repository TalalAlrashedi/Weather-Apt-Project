import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Email and password are required.",
      },
    });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: "EMAIL_EXISTS", message: "Email already registered." },
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({ success: true, data: { token } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong." },
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password.",
        },
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ success: true, data: { token } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Something went wrong." },
    });
  }
};

export const signout = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: true, message: "Signed out successfully." });
};
