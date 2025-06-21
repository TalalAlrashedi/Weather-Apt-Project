import mongoose, { Schema, Document } from "mongoose";

export interface IHistory extends Document {
  user: mongoose.Types.ObjectId;
  weather: mongoose.Types.ObjectId;
  lat: number;
  lon: number;
  requestedAt: Date;
}

const HistorySchema = new Schema<IHistory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    weather: {
      type: Schema.Types.ObjectId,
      ref: "Weather",
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  }
);

HistorySchema.index({ user: 1, requestedAt: -1 });

export const History = mongoose.model<IHistory>("History", HistorySchema);
