import { z } from "zod";
import { Battery } from "@/utils/interfaces/common";

export const RegisterBeaconSchema = z.object({
  bnid: z.number().min(1).max(50),
});

export const GetBeaconsSchema = z.object({
  location: z.nativeEnum(Battery),
});

export const DeleteBeaconSchema = z.object({
  bnid: z.coerce.number().min(1).max(50),
});

export const AssignEmployeeSchema = z.object({
  bnid: z.coerce.number().min(1).max(50),
  employeeName: z.string().min(1),
});

export const ClearEmployeeSchema = DeleteBeaconSchema;

export const UpdateBeaconSchema = z.object({
  GWID: z.coerce
    .number()
    .refine(
      (val) =>
        val === 0 || val === 201 || val === 226 || val === 202 || val === 227,
      {
        message: "Invalid Gateway ID. Only 0, 201, 226, 202, 227 are allowed.",
      }
    ),
  CPID: z.coerce
    .number()
    .refine(
      (value) =>
        value === 0 ||
        (value >= 101 && value <= 116) ||
        (value >= 151 && value <= 166),
      {
        message: "cpid must be 0, between 101-116, or between 151-166",
      }
    ),
  BNID: z.coerce.number().min(0).max(50),
  SOS: z.enum(["L", "H"], {
    message: "SOS must be either 'L' or 'H'.",
  }),
  IDLE: z.enum(["L", "H"], {
    message: "IDLE must be either 'L' or 'H'.",
  }),
  BATTERY: z.coerce
    .number()
    .min(15, { message: "Battery level must be at least 15." })
    .max(100, { message: "Battery level cannot exceed 100." }),
  LOCATION: z
    .enum(["DCS"], {
      message: "Location must be 'DCS",
    })
    .optional(),
});

export const GetBeaconPathSchema = z.object({
  bnid: z.coerce.number().min(1).max(50),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  battery: z.nativeEnum(Battery),
});
