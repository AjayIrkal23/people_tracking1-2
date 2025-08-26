import { Battery } from "./map";

export enum BeaconStatus {
  OK = "OK",
  SOS = "SOS",
  IDLE = "IDLE",
}

export enum BeaconLocation {
  dcsRoom = "DCS",
  battery5 = "battery 1",
  battery6 = "battery 2",
}

export interface Beacon {
  _id: string;
  bnid: number;
  latestCpid: number;
  latestGwid: number;
  latestBoundingBox: number[];
  status: BeaconStatus;
  location: BeaconLocation;
  battery: number;
  assignedEmployee: string;
  lastActive: Date;
  employeeLastAssigned: Date;
}

export type DeleteBeaconType = { open: boolean; bnid: number | null };

export type AssignEmployeeType = DeleteBeaconType;

export type BeaconColor = {
  bnid: number;
  color: string;
};

export enum GatewaySide {
  coke = "Coke Side",
  pusher = "Pusher Side",
}

export type NormalizedCoords = {
  normalizedX: number;
  normalizedY: number;
};

export interface Gateway {
  _id: string;
  gwid: 201 | 226;
  location: Battery;
  side: GatewaySide;
  positionOnMap: NormalizedCoords & { normalizedSize: number };
  connectPoints: string[];
  lastActiveDateTime: Date;
}

export interface ConnectPoint {
  _id: string;
  cpid: number;
  range: {
    pillarStart: number;
    pillarEnd: number;
  };
  positionOnMap: NormalizedCoords & { normalizedSize: number };
  boundingBoxOnMap: number[];
  parentGateway: Gateway | null;
  lastActiveDateTime: Date;
}

export type DeleteConnectPointType = { open: boolean; cpid: number | null };

export type DeleteGatewayType = { open: boolean; gwid: number | null };

export type AddDeviceOnMapType = {
  active: boolean;
  modalOpen: boolean;
  clickX: number;
  clickY: number;
};

export interface BoundingBoxState {
  active: boolean;
  points: number[];
  modalOpen: boolean;
}

export interface AssignmentHistory {
  _id: string;
  bnid: number;
  employee: string;
  assignedAt: string;
}

export interface BeaconPath {
  bnid: number;
  latestCpid: number;
  latestGwid: number;
  latestBoundingBox: number[];
  location: Battery;
  createdAt: string;
}
