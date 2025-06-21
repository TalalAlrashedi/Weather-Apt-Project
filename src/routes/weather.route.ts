import { Router } from "express";
import { getWeather } from "../controllers/weather.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getWeather);

export default router;