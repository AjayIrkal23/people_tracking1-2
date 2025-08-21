import { z } from "zod";
import { GatewaySide } from "./gateway.interface";
import { Battery } from "@/utils/interfaces/common";

const ObjectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, { message: "Invalid ObjectId format" });

export const RegisterGatewaySchema = z.object({
  gwid: z.union([
    z.literal(201),
    z.literal(226),
    z.literal(202),
    z.literal(227),
  ]),
  location: z.nativeEnum(Battery),
  side: z.nativeEnum(GatewaySide),
  connectPoints: z.array(ObjectId),
});

export const GetGatewaysSchema = z.object({
  location: z.nativeEnum(Battery),
});

export const DeleteGatewaySchema = z.object({
  gwid: z.coerce
    .number()
    .refine((val) => val === 201 || val === 226 || val === 202 || val === 227, {
      message: "Invalid Gateway ID. Only 201, 226, 202 and 227 are allowed.",
    }),
});

export const AddGatewayOnMapSchema = z.object({
  gwid: z.union([
    z.literal(201),
    z.literal(226),
    z.literal(202),
    z.literal(227),
  ]),
  normalizedX: z.number(),
  normalizedY: z.number(),
});

export const RemoveGatewayFromMapSchema = z.object({
  gwid: z.coerce
    .number()
    .refine((val) => val === 201 || val === 226 || val === 202 || val === 227, {
      message: "Invalid Gateway ID. Only 201, 226, 202 and 227 are allowed.",
    }),
});
