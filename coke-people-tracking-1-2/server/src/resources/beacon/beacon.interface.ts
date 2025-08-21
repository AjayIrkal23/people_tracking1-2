export enum BeaconStatus {
  OK = "OK",
  SOS = "SOS",
  IDLE = "IDLE",
}

export enum BeaconLocation {
  dcsRoom = "DCS",
  battery1 = "battery 1",
  battery2 = "battery 2",
}

export interface IBeacon {
  bnid: number;
  latestCpid: number;
  latestGwid: number;
  latestBoundingBox: number[];
  status: BeaconStatus;
  location: BeaconLocation;
  assignedEmployee: string;
  battery: number;
  lastActive: Date;
  employeeLastAssigned: Date;
}

export interface IAssignmentHistory {
  bnid: number;
  employee: string;
  assignedAt: Date;
}
