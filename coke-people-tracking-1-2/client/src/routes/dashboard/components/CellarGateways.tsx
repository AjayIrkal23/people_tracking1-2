import React, { useContext } from "react";
import { Gateway } from "@/interfaces/device";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import useCalculateCanvasMeasures from "../hooks/useCalculateCanvasMeasures";
import { handleApiError } from "@/helpers/handleApiError";
import useAuth from "@/hooks/auth/useAuth";
import { DEVICE_NORMALIZED_SIZE, GATEWAY_ACTIVE_MINUTES } from "@/constants";
import { useMemo } from "react";
import { getMinutesDifference } from "@/helpers/getMinutesDifference";
import MapContext from "@/context/MapContext";

interface CellarGatewaysProps {
  gateways: Gateway[];
  fetchGateways: () => void;
}

interface GatewayIndicatorProps {
  scale: number;
  gwid: number;
  x: number;
  y: number;
  size: number;
  lastActiveMinutesAgo: number;
  fetchGateways: () => void;
}

const GatewayIndicator: React.FC<GatewayIndicatorProps> = React.memo(
  ({ gwid, x, y, size, fetchGateways, scale, lastActiveMinutesAgo }) => {
    const axiosPrivate = useAxiosPrivate();
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";
    const isActive = lastActiveMinutesAgo < GATEWAY_ACTIVE_MINUTES;

    const removeGatewayFromMap = async () => {
      try {
        await axiosPrivate.patch(`/gateway/removeFromMap/${gwid}`);
        fetchGateways();
      } catch (error) {
        handleApiError(error);
      }
    };

    return (
      <span
        style={{
          left: `${x}px`,
          top: `${y}px`,
          width: `${size * 1.9}px`,
          height: `${size * 1.9}px`,
          transform: `scale(${1 / scale})`,
        }}
        className={`absolute rounded-lg ${
          isActive ? "bg-green-500" : "bg-red-500"
        } flex items-center justify-center text-white font-semibold p-4 shadow-device`}
        onDoubleClick={isAdmin ? removeGatewayFromMap : undefined}
      >
        <span
          style={{
            fontSize: `${size * 0.9}px`,
          }}
        >
          {gwid}
        </span>
      </span>
    );
  }
);

const CellarGateways: React.FC<CellarGatewaysProps> = ({
  gateways,
  fetchGateways,
}) => {
  const canvasMeasures = useCalculateCanvasMeasures();
  const { scale } = useContext(MapContext);

  const gatewayConfig = useMemo(() => {
    return gateways
      .filter((gateway) => gateway.positionOnMap)
      .map((gateway) => ({
        gwid: gateway.gwid,
        x: gateway.positionOnMap.normalizedX * canvasMeasures.width,
        y: gateway.positionOnMap.normalizedY * canvasMeasures.height,
        size:
          DEVICE_NORMALIZED_SIZE *
          Math.min(canvasMeasures.width, canvasMeasures.height),
        lastActiveMinutesAgo: getMinutesDifference(gateway.lastActiveDateTime),
      }));
  }, [gateways, canvasMeasures.width, canvasMeasures.height]);

  return gatewayConfig.map((config) => (
    <GatewayIndicator
      gwid={config.gwid}
      x={config.x}
      y={config.y}
      size={config.size}
      scale={scale}
      fetchGateways={fetchGateways}
      lastActiveMinutesAgo={config.lastActiveMinutesAgo}
    />
  ));
};

export default CellarGateways;
