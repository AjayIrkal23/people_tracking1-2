import { useEffect, useRef } from "react";
import { Modal } from "antd";
import { Gateway } from "@/interfaces/device";
import { getInactiveGateways } from "@/components/getInactiveGateways";

interface GatewayInactiveNotificationProps {
  gateways: Gateway[];
}

const GatewayInactiveNotification = ({
  gateways,
}: GatewayInactiveNotificationProps) => {
  const alertedGateways = useRef<Set<number>>(new Set());

  useEffect(() => {
    const inactiveGateways = getInactiveGateways(gateways);

    inactiveGateways.forEach((gateway) => {
      if (!alertedGateways.current.has(gateway.gwid)) {
        Modal.error({
          title: "Gateway Inactive",
          content: `Gateway ${gateway.gwid} has been inactive for over an hour.`,
        });
        alertedGateways.current.add(gateway.gwid);
      }
    });
  }, [gateways]);

  return null;
};

export default GatewayInactiveNotification;
