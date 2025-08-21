import { Schema, model, Document } from "mongoose";

export enum EventType {
  DCS_DEVICE_HEARTBEAT = "dcs_device_heartbeat",
  CONNECT_POINT_HEARTBEAT = "connect_point_heartbeat",
  GATEWAY_HEARTBEAT = "gateway_heartbeat",
  BEACON_TO_DCS_DEVICE = "beacon_to_dcs_device",
  BEACON_TO_CONNECT_POINT = "beacon_to_connect_point",
}

export interface Logs extends Document {
  eventType: EventType;
  createdAt: Date;
}

const LogsSchema = new Schema<Logs>(
  {
    eventType: {
      type: String,
      enum: Object.values(EventType),
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
  }
);

export const LogsModel = model<Logs>("Logs", LogsSchema);
