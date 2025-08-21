import { z } from "zod";
import { EventType } from "./logs.model";

export const GetLogsSchema = z.object({
  startDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined))
    .refine((date) => !date || !isNaN(date.getTime()), {
      message:
        "Invalid start date format. Expected ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ)",
    }),

  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined))
    .refine((date) => !date || !isNaN(date.getTime()), {
      message:
        "Invalid end date format. Expected ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ)",
    }),

  eventType: z.nativeEnum(EventType).optional(),
});
