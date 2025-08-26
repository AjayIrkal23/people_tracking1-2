import React, { useContext } from "react";
import { handleApiError } from "@/helpers/handleApiError";
import useCalculateCanvasMeasures from "../hooks/useCalculateCanvasMeasures";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { ConnectPoint } from "@/interfaces/device";
import useAuth from "@/hooks/auth/useAuth";
import {
  CONNECT_POINT_ACTIVE_MINUTES,
  DEVICE_NORMALIZED_SIZE,
} from "@/constants";
import { useMemo } from "react";
import { getMinutesDifference } from "@/helpers/getMinutesDifference";
import MapContext from "@/context/MapContext";

interface CellarConnectPointsProps {
  connectPoints: ConnectPoint[];
  fetchConnectPoints: () => void;
}

interface ConnectPointIndicatorProps {
  scale: number;
  cpid: number;
  x: number;
  y: number;
  size: number;
  range: string;
  lastActiveMinutesAgo: number;
  fetchConnectPoints: () => void;
}

const ConnectPointIndicator: React.FC<ConnectPointIndicatorProps> = React.memo(
  ({
    cpid,
    x,
    y,
    size,
    range,
    fetchConnectPoints,
    scale,
    lastActiveMinutesAgo,
  }) => {
    const axiosPrivate = useAxiosPrivate();
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";
    const isActive = lastActiveMinutesAgo < CONNECT_POINT_ACTIVE_MINUTES;

    const removeConnectPointFromMap = async () => {
      try {
        await axiosPrivate.patch(`/connectPoint/removeFromMap/${cpid}`);
        fetchConnectPoints();
      } catch (error) {
        handleApiError(error);
      }
    };

    const isRangeBelow = cpid >= 101 && cpid <= 116;

    return (
      <span
        style={{
          left: `${x}px`,
          top: `${y}px`,
          width: `${size * 1.9}px`,
          height: `${size * 1.9}px`,
          transform: `scale(${1 / scale})`,
        }}
        className={`absolute rounded-full ${
          isActive ? "bg-green-500" : "bg-red-500"
        } flex items-center justify-center text-white font-semibold shadow-device p-4`}
        onDoubleClick={isAdmin ? removeConnectPointFromMap : undefined}
      >
        <span
          style={{
            fontSize: `${size * 0.9}px`,
          }}
        >
          {cpid}
        </span>
      </span>
    );
  }
);

const CellarConnectPoints: React.FC<CellarConnectPointsProps> = ({
  connectPoints,
  fetchConnectPoints,
}) => {
  const canvasMeasures = useCalculateCanvasMeasures();
  const { scale } = useContext(MapContext);

  const cpConfig = useMemo(() => {
    return connectPoints
      .filter((connectPoint) => connectPoint.positionOnMap)
      .map((connectPoint) => ({
        cpid: connectPoint.cpid,
        x: connectPoint.positionOnMap.normalizedX * canvasMeasures.width,
        y: connectPoint.positionOnMap.normalizedY * canvasMeasures.height,
        size:
          DEVICE_NORMALIZED_SIZE *
          Math.min(canvasMeasures.width, canvasMeasures.height),
        range: `${connectPoint.range.pillarStart} - ${connectPoint.range.pillarEnd}`,
        lastActiveMinutesAgo: getMinutesDifference(
          connectPoint.lastActiveDateTime
        ),
      }));
  }, [connectPoints, canvasMeasures.width, canvasMeasures.height]);

  return cpConfig.map((config) => (
    <ConnectPointIndicator
      cpid={config.cpid}
      x={config.x}
      y={config.y}
      size={config.size}
      range={config.range}
      fetchConnectPoints={fetchConnectPoints}
      scale={scale}
      lastActiveMinutesAgo={config.lastActiveMinutesAgo}
    />
  ));
};

export default CellarConnectPoints;
