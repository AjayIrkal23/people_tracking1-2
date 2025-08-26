import { Schema, model } from "mongoose";
import { IBeaconTrack, BeaconLocation } from "./beacon.interface";

const BeaconTrackSchema = new Schema<IBeaconTrack>(
  {
    bnid: { type: Number, required: true },
    latestCpid: { type: Number, required: true },
    latestGwid: { type: Number, required: true },
    latestBoundingBox: { type: [Number], required: true },
    location: {
      type: String,
      enum: Object.values(BeaconLocation),
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<IBeaconTrack>("BeaconTrack", BeaconTrackSchema);
