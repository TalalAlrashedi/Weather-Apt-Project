import dotenv from "dotenv";
dotenv.config();

if (!process.env.OPENWEATHER_API_KEY) {
  throw new Error("Missing OPENWEATHER_API_KEY in environment variables");
}

export const CONFIG = {
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret",
  WEATHER_CACHE_MINUTES: parseInt(process.env.WEATHER_CACHE_MINUTES || "30"),
};