import { GatewaySide } from "./device";

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

export interface Violation {
  _id: string;
  bnid: number;
  cpid: number;
  gwid: number;
  violationType: ViolationType;
  employeeName: string;
  location: GatewaySide;
  createdAt: Date;
}
