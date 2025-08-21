export enum EventType {
  DCS_DEVICE_HEARTBEAT = "dcs_device_heartbeat",
  CONNECT_POINT_HEARTBEAT = "connect_point_heartbeat",
  GATEWAY_HEARTBEAT = "gateway_heartbeat",
  BEACON_TO_DCS_DEVICE = "beacon_to_dcs_device",
  BEACON_TO_CONNECT_POINT = "beacon_to_connect_point",
}

export interface Log {
  _id: string;
  eventType: EventType;
  createdAt: Date;
}
