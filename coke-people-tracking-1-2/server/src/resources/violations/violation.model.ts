import { Schema, model } from "mongoose";
import { Violation, ViolationType } from "./violation.interface";
import { GatewaySide } from "../gateway/gateway.interface";

const ViolationSchema = new Schema<Violation>(
  {
    bnid: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
    },
    cpid: { type: Number, required: true },
    gwid: { type: Number, required: true, enum: [201, 226, 202, 227] },
    violationType: {
      type: String,
      enum: Object.values(ViolationType),
      required: true,
    },
    employeeName: { type: String },
    location: {
      type: String,
      enum: Object.values(GatewaySide),
      required: true,
    },
  },
  { timestamps: true }
);

export default model<Violation>("Violation", ViolationSchema);
