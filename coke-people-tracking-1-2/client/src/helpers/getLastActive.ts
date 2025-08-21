import { formatDistanceToNow } from "date-fns";

export const getLastActive = (timestamp: Date): string => {
  return `${formatDistanceToNow(new Date(timestamp), { addSuffix: true })}`;
};
