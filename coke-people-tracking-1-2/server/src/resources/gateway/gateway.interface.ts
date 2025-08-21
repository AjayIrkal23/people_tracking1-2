import { Types } from "mongoose";
import { Battery } from "@/utils/interfaces/common";

export enum GatewaySide {
  coke = "Coke Side",
  pusher = "Pusher Side",
}

export type NormalizedCoords = {
  normalizedX: number;
  normalizedY: number;
};

export interface IGateway {
  gwid: 201 | 226;
  location: Battery;
  side: GatewaySide;
  positionOnMap: NormalizedCoords;
  connectPoints: Types.ObjectId[];
  lastActiveDateTime: Date;
}
