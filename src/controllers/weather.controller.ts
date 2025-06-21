import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { Weather } from "../models/Weather.model";
import { History } from "../models/History.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const API_KEY = process.env.OPENWEATHER_API_KEY!;
console.log("OpenWeather API Key:", process.env.OPENWEATHER_API_KEY);
const CACHE_MINUTES = parseInt(process.env.WEATHER_CACHE_MINUTES || "30");

export const getWeather = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({
        success: false,
        error: { code: "MISSING_PARAMS", message: "lat and lon are required" },
      });
      return;
    }

    const roundedLat = Math.round(Number(lat) * 100) / 100;
    const roundedLon = Math.round(Number(lon) * 100) / 100;

    const now = new Date();
    const minFetchedAt = new Date(now.getTime() - CACHE_MINUTES * 60 * 1000);

    let weather = await Weather.findOne({
      lat: roundedLat,
      lon: roundedLon,
      fetchedAt: { $gte: minFetchedAt },
    });

    let source = "cache";

    if (!weather) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${roundedLat}&lon=${roundedLon}&appid=${API_KEY}&units=metric`;
      const response = await axios.get(url);
      const weatherData = response.data;

      const updated = await Weather.findOneAndUpdate(
        { lat: roundedLat, lon: roundedLon },
        { data: weatherData, fetchedAt: new Date() },
        { upsert: true, new: true }
      );

      if (!updated) {
        throw new Error("Failed to save weather data");
      }

      weather = updated;
      source = "openweather";
    }

    if (!weather) {
      res.status(500).json({
        success: false,
        error: { code: "WEATHER_NOT_FOUND", message: "Weather data not available." },
      });
      return;
    }

    await History.create({
      user: req.userId,
      weather: weather._id,
      lat: roundedLat,
      lon: roundedLon,
    });

    const { temp } = weather.data.main;
    const description = weather.data.weather?.[0]?.description;
    const humidity = weather.data.main.humidity;

    res.json({
      success: true,
      data: {
        source,
        coordinates: { lat: roundedLat, lon: roundedLon },
        tempC: temp,
        humidity,
        description,
        fetchedAt: weather.fetchedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};