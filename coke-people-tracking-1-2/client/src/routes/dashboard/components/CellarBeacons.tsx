import React, { useContext, useMemo } from "react";
import useCalculateCanvasMeasures from "../hooks/useCalculateCanvasMeasures";
import { Beacon, BeaconLocation, BeaconStatus } from "@/interfaces/device";
import { BEACON_DISPLAY_MINUTES, DEVICE_NORMALIZED_SIZE } from "@/constants";
import { getMinutesDifference } from "@/helpers/getMinutesDifference";
import { UserOutlined } from "@ant-design/icons";
import { getRandomColor } from "@/helpers/getRandomColor";
import { getRandomPoint } from "@/helpers/getRandomPoint";
import { Tooltip } from "antd";
import DeviceContext from "@/context/DeviceContext";
import MapContext from "@/context/MapContext";

interface CellarBeaconsProps {
  beacons: Beacon[];
}

interface BeaconIndicatorProps {
  bnid: number;
  status: BeaconStatus;
  x: number;
  y: number;
  size: number;
  scale: number;
  bgColor: string;
  employee: string;
  battery: number;
}

const BeaconIndicator = React.memo(
  ({
    bnid,
    status,
    x,
    y,
    size,
    scale,
    bgColor,
    employee,
    battery,
  }: BeaconIndicatorProps) => {
    const beaconSize = Math.round(size * 1.9);
    const beaconColor: Record<BeaconStatus, string> = {
      OK: bgColor,
      SOS: "red",
      IDLE: "orange",
    };

    return (
      <div
        className="absolute flex flex-col items-center transition-all duration-300 ease-out z-40"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: `scale(${1 / scale})`,
          willChange: "left, top, transform",
        }}
      >
        {/* BNID Label */}
        <div
          className={`mb-1 px-2 py-0.5 rounded text-white text-sm font-medium shadow-device`}
          style={{
            background: beaconColor[status],
          }}
        >
          0{bnid}
        </div>

        {/* Beacon Indicator */}
        <div
          className={`flex items-center justify-center rounded-full shadow-device`}
          style={{
            width: `${beaconSize}px`,
            height: `${beaconSize}px`,
            background: beaconColor[status],
          }}
        >
          <div className="relative flex items-center justify-center w-full h-full">
            <div
              className={`absolute w-full h-full rounded-full animate-ping-slow bg-green-500`}
              style={{
                background:
                  beaconColor[status] === bgColor ? "" : beaconColor[status],
              }}
            />

            <Tooltip title={`${employee} (${battery}%)`} placement="bottom">
              <div className="relative z-10 text-white text-xl">
                <UserOutlined size={24} className="stroke-2" />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
);

const CellarBeacons: React.FC<CellarBeaconsProps> = ({ beacons }) => {
  const canvasMeasures = useCalculateCanvasMeasures();
  const { scale, location } = useContext(MapContext);
  const { beaconStyles } = useContext(DeviceContext);

  const bnConfig = useMemo(() => {
    return beacons
      .filter((beacon) => {
        const lastActive = getMinutesDifference(beacon.lastActive);
        const beaconIsActive = lastActive < BEACON_DISPLAY_MINUTES;
        const hasCpid = beacon.latestCpid; // to make sure it's not null
        const inCellarArea =
          beacon.location === (location as unknown as BeaconLocation);
        return beaconIsActive && hasCpid && inCellarArea;
      })
      .map((beacon) => {
        const existingStyle = beaconStyles.current[beacon.bnid];
        const shouldUpdatePosition =
          !existingStyle || existingStyle.lastCpid !== beacon.latestCpid;

        if (!existingStyle || shouldUpdatePosition) {
          const { normalizedRandomX, normalizedRandomY } = getRandomPoint(
            beacon.latestBoundingBox,
            canvasMeasures.width,
            canvasMeasures.height
          );

          const beaconColor = shouldUpdatePosition
            ? getRandomColor()
            : existingStyle.color;

          beaconStyles.current[beacon.bnid] = {
            color: beaconColor,
            normalizedPosition: {
              x: normalizedRandomX,
              y: normalizedRandomY,
            },
            lastCpid: beacon.latestCpid,
          };
        }

        const { color, normalizedPosition } = beaconStyles.current[beacon.bnid];

        return {
          bnid: beacon.bnid,
          status: beacon.status,
          x: normalizedPosition.x * canvasMeasures.width,
          y: normalizedPosition.y * canvasMeasures.height,
          size:
            DEVICE_NORMALIZED_SIZE *
            Math.min(canvasMeasures.width, canvasMeasures.height),
          bgColor: color,
          employee: beacon.assignedEmployee,
          battery: beacon.battery,
        };
      });
  }, [beacons, canvasMeasures.width, canvasMeasures.height]);

  return bnConfig.map((config) => (
    <BeaconIndicator
      key={config.bnid}
      bnid={config.bnid}
      status={config.status}
      x={config.x}
      y={config.y}
      size={config.size}
      scale={scale}
      bgColor={config.bgColor}
      employee={config.employee}
      battery={config.battery}
    />
  ));
};

export default CellarBeacons;
