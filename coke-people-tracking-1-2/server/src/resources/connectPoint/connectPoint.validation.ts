import { Battery } from "@/utils/interfaces/common";
import { z } from "zod";

export const RegisterConnectPointSchema = z.object({
  cpid: z
    .number()
    .refine(
      (value) =>
        (value >= 101 && value <= 116) || (value >= 151 && value <= 166),
      {
        message: "cpid must be between 101-108 or 151-158",
      }
    ),
  pillarStart: z.number(),
  pillarEnd: z.number(),
});

export const GetConnectPointsSchema = z.object({
  location: z.nativeEnum(Battery),
});

export const DeleteConnectPointSchema = z.object({
  cpid: z.coerce
    .number()
    .refine(
      (value) =>
        (value >= 101 && value <= 116) || (value >= 151 && value <= 166),
      {
        message: "cpid must be between 101-108 or 151-158",
      }
    ),
});

export const AddConnectPointOnMapSchema = z.object({
  cpid: z
    .number()
    .refine(
      (value) =>
        (value >= 101 && value <= 116) || (value >= 151 && value <= 166),
      {
        message: "cpid must be between 101-108 or 151-158",
      }
    ),
  normalizedX: z.number(),
  normalizedY: z.number(),
});

export const AddConnectPointROIOnMapSchema = z.object({
  cpid: z
    .number()
    .refine(
      (value) =>
        (value >= 101 && value <= 116) || (value >= 151 && value <= 166),
      {
        message: "cpid must be between 101-108 or 151-158",
      }
    ),
  roiPoints: z
    .array(z.number())
    .length(8, { message: "roiPoints must contain exactly 8 numbers" }),
});

export const RemoveConnectPointFromMapSchema = z.object({
  cpid: z.coerce
    .number()
    .refine(
      (value) =>
        (value >= 101 && value <= 116) || (value >= 151 && value <= 166),
      {
        message: "cpid must be between 101-108 or 151-158",
      }
    ),
});

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export const GetConnectPointLogSchema = z.object({
  date: z.string().refine((val) => !val || isoDateRegex.test(val), {
    message:
      "Invalid start date format. Must be ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ)",
  }),
});
