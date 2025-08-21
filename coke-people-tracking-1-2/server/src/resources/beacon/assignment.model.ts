import { Schema, model } from "mongoose";
import { IAssignmentHistory } from "./beacon.interface";

const AssignmentHistorySchema = new Schema<IAssignmentHistory>(
  {
    bnid: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
    },
    employee: {
      type: String,
      default: "Unassigned",
    },
    assignedAt: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<IAssignmentHistory>(
  "AssignmentHistory",
  AssignmentHistorySchema
);
