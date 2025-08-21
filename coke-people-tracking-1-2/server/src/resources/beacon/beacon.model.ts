import { Schema, model } from "mongoose";
import { IBeacon, BeaconStatus, BeaconLocation } from "./beacon.interface";

const BeaconSchema = new Schema<IBeacon>(
  {
    bnid: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
    },
    latestCpid: {
      type: Number,
      default: null,
    },
    latestGwid: {
      type: Number,
      default: null,
    },
    latestBoundingBox: {
      type: [Number],
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(BeaconStatus),
      required: true,
      default: BeaconStatus.OK,
    },
    location: {
      type: String,
      enum: Object.values(BeaconLocation),
      required: true,
      default: BeaconLocation.dcsRoom,
    },
    battery: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    assignedEmployee: {
      type: String,
      default: "Unassigned",
    },
    lastActive: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    employeeLastAssigned: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<IBeacon>("Beacon", BeaconSchema);
