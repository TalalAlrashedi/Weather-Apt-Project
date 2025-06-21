import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getHistory } from "../controllers/history.controller";

const router = Router();

router.get("/", authenticate, getHistory);

export default router;
