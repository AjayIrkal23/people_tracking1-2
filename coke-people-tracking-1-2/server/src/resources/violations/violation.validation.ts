import { z } from "zod";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export const GetViolationSchema = z
  .object({
    startDate: z
      .string()
      .optional()
      .refine((val) => !val || isoDateRegex.test(val), {
        message:
          "Invalid start date format. Must be ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ)",
      }),
    endDate: z
      .string()
      .optional()
      .refine((val) => !val || isoDateRegex.test(val), {
        message:
          "Invalid end date format. Must be ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ)",
      }),
    shift: z.enum(["A", "B", "C", "F"]),
  })
  .refine(
    (data) =>
      (!data.startDate && !data.endDate) || (data.startDate && data.endDate),
    {
      message: "Both startDate and endDate must be provided together.",
      path: ["startDate", "endDate"],
    }
  );
