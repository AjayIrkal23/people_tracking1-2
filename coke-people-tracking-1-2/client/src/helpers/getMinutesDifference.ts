import { differenceInMinutes } from "date-fns";

export function getMinutesDifference(inputDate: Date): number {
  const now = new Date();
  return differenceInMinutes(now, inputDate);
}
