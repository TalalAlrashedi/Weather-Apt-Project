import mongoose, { Schema, Document } from "mongoose";

export interface IWeather extends Document {
  lat: number;
  lon: number;
  data: any;
  fetchedAt: Date;
}

const WeatherSchema = new Schema<IWeather>(
  {
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    fetchedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: { expires: "30m" },
    },
  },
  {
    versionKey: false,
  }
);

WeatherSchema.pre("save", function (next) {
  this.lat = Math.round(this.lat * 100) / 100;
  this.lon = Math.round(this.lon * 100) / 100;
  next();
});

WeatherSchema.index({ lat: 1, lon: 1 }, { unique: true });

export const Weather = mongoose.model<IWeather>("Weather", WeatherSchema);
