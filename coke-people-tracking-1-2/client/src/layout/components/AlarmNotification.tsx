import React, { useContext, useEffect } from "react";
import { Beacon, BeaconLocation } from "@/interfaces/device";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useAlarmNotifications } from "../hooks/useAlarmNotification";
import MapContext from "@/context/MapContext";

interface AlarmNotificationProps {
  beacons: Beacon[];
}

const AlarmNotification: React.FC<AlarmNotificationProps> = ({ beacons }) => {
  const { location } = useContext(MapContext);
  const { notifications, addNotification, removeNotification } =
    useAlarmNotifications();

  useEffect(() => {
    beacons.forEach((beacon) => {
      if (
        (beacon.status === "SOS" || beacon.status === "IDLE") &&
        beacon.location === (location as unknown as BeaconLocation) &&
        !notifications.some((n) => n.id === beacon.bnid)
      ) {
        addNotification(
          beacon.bnid,
          `${beacon.assignedEmployee} (BNID: ${beacon.bnid}) has triggered an ${beacon.status} alert.`,
          beacon.status
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beacons]);

  return (
    <div className="fixed top-8 right-8 z-50 space-y-4">
      {notifications.map((notification) => {
        const isSOS = notification.status === "SOS";
        const notificationBorderColor = isSOS
          ? "border-red-400"
          : "border-orange-400"; // Set border color
        const notificationTextColor = isSOS
          ? "text-red-800"
          : "text-orange-800"; // Set text color
        const buttonBgColor = isSOS ? "bg-red-500" : "bg-orange-500"; // Set button background color
        const buttonHoverColor = isSOS
          ? "hover:bg-red-600"
          : "hover:bg-orange-600"; // Set button hover color

        return (
          <div key={notification.id} className="w-96 animate-fadeIn">
            <div
              className={`flex items-start bg-white border-2 ${notificationBorderColor} rounded-lg p-6 shadow-lg`}
            >
              <div className="mr-4 text-red-600 flex-shrink-0">
                <ExclamationCircleOutlined className="text-4xl" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h4 className={`${notificationTextColor} font-bold text-lg`}>
                    {notification.status === "SOS" ? "SOS Alert" : "Idle Alert"}
                  </h4>
                </div>
                <p
                  className={`${notificationTextColor} text-sm mt-2 leading-relaxed`}
                >
                  {notification.message}
                </p>
                <div className="mt-4 flex flex-row-reverse">
                  <button
                    className={`${buttonBgColor} text-white font-semibold px-4 py-2 rounded-md ${buttonHoverColor} transition-all`}
                    onClick={() => removeNotification(notification.id)}
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlarmNotification;
