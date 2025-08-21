// 1. File: connectPointLogs.model.ts
// Make sure this file uses a named export instead of default export:
import { Schema, model, Document } from "mongoose";

export interface ConnectPointLogs extends Document {
  date: string;
  cpids: {
    [key: string]: Date[];
  };
}

const ConnectPointLogsSchema = new Schema<ConnectPointLogs>(
  {
    date: {
      type: String,
      required: true,
    },
    cpids: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Add a single unique index on the date field
ConnectPointLogsSchema.index({ date: 1 }, { unique: true });

// Use named export (not default export)
export const ConnectPointLogsModel = model<ConnectPointLogs>(
  "ConnectPointLogs",
  ConnectPointLogsSchema
);
