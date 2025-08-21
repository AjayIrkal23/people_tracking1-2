import useBeacon from "@/hooks/useBeacon";
import useConnectPoint from "@/hooks/useConnectPoint";
import useGateway from "@/hooks/useGateway";
import { Beacon, ConnectPoint, Gateway } from "@/interfaces/device";
import React, { createContext, useRef } from "react";
import { MutableRefObject } from "react";

type DeviceContextProviderProps = {
  children: React.ReactNode;
};

interface BeaconStyle {
  color: string;
  normalizedPosition: { x: number; y: number };
  lastCpid?: number;
}

type DeviceContextType = {
  beacons: Beacon[];
  beaconStyles: MutableRefObject<Record<number, BeaconStyle>>;
  gateways: Gateway[];
  connectPoints: ConnectPoint[];
  fetchBeacons: () => void;
  fetchConnectPoints: () => void;
  fetchGateways: () => void;
};

const DeviceContext = createContext({} as DeviceContextType);

export const DeviceProvider = ({ children }: DeviceContextProviderProps) => {
  const { beacons, fetchBeacons } = useBeacon();
  const { connectPoints, fetchConnectPoints } = useConnectPoint();
  const { gateways, fetchGateways } = useGateway();
  const beaconStyles = useRef<Record<number, BeaconStyle>>({});

  return (
    <DeviceContext.Provider
      value={{
        beacons,
        beaconStyles,
        connectPoints,
        gateways,
        fetchBeacons,
        fetchConnectPoints,
        fetchGateways,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export default DeviceContext;
