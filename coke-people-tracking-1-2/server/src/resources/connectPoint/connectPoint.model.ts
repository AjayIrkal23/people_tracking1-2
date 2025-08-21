import { Schema, model } from "mongoose";
import { Types } from "mongoose";
import { IConnectPoint, NormalizedCoords } from "./connectPoint.interface";

const NormalizedCoordsSchema = new Schema<NormalizedCoords>(
  {
    normalizedX: { type: Number, required: true, min: 0, max: 1 },
    normalizedY: { type: Number, required: true, min: 0, max: 1 },
  },
  { _id: false }
);

const ConnectPointSchema = new Schema<IConnectPoint>(
  {
    cpid: { type: Number, required: true },
    range: {
      pillarStart: { type: Number, required: true },
      pillarEnd: { type: Number, required: true },
    },
    positionOnMap: {
      type: NormalizedCoordsSchema,
      default: null,
    },
    boundingBoxOnMap: {
      type: [Number],
      default: null,
    },
    parentGateway: { type: Types.ObjectId, ref: "Gateway", default: null },
    lastActiveDateTime: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<IConnectPoint>("ConnectPoint", ConnectPointSchema);
