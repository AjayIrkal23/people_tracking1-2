import { Document } from "mongoose";
import { GatewaySide } from "../gateway/gateway.interface";

export enum ViolationType {
  SOS = "SOS",
  IDLE = "IDLE",
}

export enum Shift {
  A = "A",
  B = "B",
  C = "C",
  F = "F",
}

export interface Violation extends Document {
  bnid: number;
  cpid: number;
  gwid: number;
  violationType: ViolationType;
  employeeName: string;
  location: GatewaySide;
  createdAt: Date;
}
