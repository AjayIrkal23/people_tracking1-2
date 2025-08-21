import { Schema, model } from "mongoose";
import { Types } from "mongoose";
import { IGateway, GatewaySide, NormalizedCoords } from "./gateway.interface";
import { Battery } from "@/utils/interfaces/common";

const NormalizedCoordsSchema = new Schema<NormalizedCoords>(
  {
    normalizedX: { type: Number, required: true, min: 0, max: 1 },
    normalizedY: { type: Number, required: true, min: 0, max: 1 },
  },
  { _id: false }
);

const GatewaySchema = new Schema<IGateway>(
  {
    gwid: { type: Number, required: true, enum: [201, 226, 202, 227] },
    location: {
      type: String,
      enum: Object.values(Battery),
      required: true,
      default: Battery.one,
    },
    side: {
      type: String,
      enum: Object.values(GatewaySide),
      required: true,
      default: GatewaySide.coke,
    },
    positionOnMap: {
      type: NormalizedCoordsSchema,
      default: null,
    },
    connectPoints: [{ type: Types.ObjectId, ref: "ConnectPoint" }],
    lastActiveDateTime: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<IGateway>("Gateway", GatewaySchema);
