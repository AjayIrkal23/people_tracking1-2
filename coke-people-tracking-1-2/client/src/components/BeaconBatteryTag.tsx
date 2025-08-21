import React from "react";
import {
  IoBatteryFullOutline,
  IoBatteryHalfOutline,
  IoBatteryDeadOutline,
} from "react-icons/io5";

interface BatteryTagProps {
  battery: string;
}

const BeaconBatteryTag: React.FC<BatteryTagProps> = ({ battery }) => {
  const batteryLevel = parseInt(battery);

  let Icon;
  let color;

  if (batteryLevel <= 30) {
    Icon = IoBatteryDeadOutline;
    color = "#f5222d";
  } else if (batteryLevel <= 60) {
    Icon = IoBatteryHalfOutline;
    color = "#fa8c16";
  } else {
    Icon = IoBatteryFullOutline;
    color = "#52c41a";
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Icon style={{ fontSize: 20, color }} />
      <span style={{ color }}>{batteryLevel}%</span>
    </div>
  );
};

export default BeaconBatteryTag;
