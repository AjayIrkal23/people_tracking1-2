import { Gateway } from "../interfaces/device";

export const getInactiveGateways = (gateways: Gateway[]): Gateway[] => {
  const currentTime = new Date();
  return gateways.filter((gateway) => {
    const lastActive = new Date(gateway.lastActiveDateTime);
    const timeDifference =
      (currentTime.getTime() - lastActive.getTime()) / (1000 * 60 * 60); // Difference in hours
    return timeDifference > 1; // Return gateways inactive for more than 1 hour
  });
};
