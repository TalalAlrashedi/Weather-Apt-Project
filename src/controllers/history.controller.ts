import { Request, Response, NextFunction } from "express";
import { History } from "../models/History.model";

import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const getHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "User not authenticated." },
      });
      return;
    }


    const history = await History.find({ user: req.userId })
      .sort({ requestedAt: -1 })
      .populate("weather");

    res.json({
      success: true,
      data: history,
    });
  } catch (err) {
    next(err);
  }
};