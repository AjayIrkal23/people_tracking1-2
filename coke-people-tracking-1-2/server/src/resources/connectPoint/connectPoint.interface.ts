import { Types } from "mongoose";

export type NormalizedCoords = {
  normalizedX: number;
  normalizedY: number;
};

export interface IConnectPoint {
  cpid: number;
  range: {
    pillarStart: number;
    pillarEnd: number;
  };
  positionOnMap: NormalizedCoords;
  boundingBoxOnMap: number[];
  parentGateway: Types.ObjectId | null;
  lastActiveDateTime: Date;
}

export interface ConnectPointLogs {
  date: Date;
  cpids: { cpid: number; timestamps: Date[] }[];
}
