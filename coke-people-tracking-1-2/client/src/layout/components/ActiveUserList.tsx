import BeaconBatteryTag from "@/components/BeaconBatteryTag";
import { getMinutesDifference } from "@/helpers/getMinutesDifference";
import { BEACON_DISPLAY_MINUTES } from "@/constants";
import { BeaconLocation } from "@/interfaces/device";
import DeviceContext from "@/context/DeviceContext";
import { Beacon } from "@/interfaces/device";
import { CSSProperties, useContext } from "react";
import MapContext from "@/context/MapContext";
import EartkeyLogo from "./EartkeyLogo";
import DocketRunLogo from "./DocketRunLogo";

interface ActiveUserListProps {
  beacons: Beacon[];
}

const ActiveUserList: React.FC<ActiveUserListProps> = ({ beacons }) => {
  const { beaconStyles } = useContext(DeviceContext);
  const { isFullScreen, location } = useContext(MapContext);

  const normalScreenStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "0.5rem",
    height: "66.6667%",
    overflow: "auto",
  };

  const fullScreenStyles: CSSProperties = {
    width: "185px",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    gap: "4px",
    overflow: "scroll",
    position: "absolute",
    left: "1rem",
    zIndex: 9999,
  };

  return (
    <div>
      {isFullScreen && <DocketRunLogo />}
      {isFullScreen && <EartkeyLogo />}
      <div style={isFullScreen ? fullScreenStyles : normalScreenStyles}>
        {beacons
          .filter((beacon) => {
            const lastActive = getMinutesDifference(beacon.lastActive);
            const beaconIsActive = lastActive < BEACON_DISPLAY_MINUTES;
            const hasCpid = beacon.latestCpid; // to make sure it's not null
            const inCellarArea =
              beacon.location === (location as unknown as BeaconLocation);
            return beaconIsActive && hasCpid && inCellarArea;
          })
          .map((beacon) => {
            const beaconStyle = beaconStyles.current[beacon.bnid];
            const color = beaconStyle?.color || "black"; // Default to black if no style is found

            return (
              <div
                key={beacon.bnid}
                className="w-full border-2 shadow-lg p-2 mt-2 rounded-md flex gap-2 bg-white"
                style={{ borderColor: color }}
              >
                <p className="truncate font-semibold" style={{ color }}>
                  {beacon.bnid} - {beacon.assignedEmployee}
                </p>
                <BeaconBatteryTag battery={String(beacon.battery)} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ActiveUserList;
