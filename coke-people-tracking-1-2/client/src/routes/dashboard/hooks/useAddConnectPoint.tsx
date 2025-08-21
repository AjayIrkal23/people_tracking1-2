import { useState } from "react";
import { AddDeviceOnMapType } from "@/interfaces/device";

const useAddConnectPoint = () => {
  const [addConnectPoint, setAddConnectPoint] = useState<AddDeviceOnMapType>({
    active: false,
    modalOpen: false,
    clickX: 0,
    clickY: 0,
  });

  const onAddConnectPoint = () => {
    if (addConnectPoint.active) {
      setAddConnectPoint({ ...addConnectPoint, active: false });
    } else {
      setAddConnectPoint({ ...addConnectPoint, active: true });
    }
  };

  const handleAddConnectPoint = (event: React.MouseEvent) => {
    const tagName = (event.target as HTMLElement).tagName;
    if (tagName === "CANVAS" || tagName === "DIV") {
      const container = event.currentTarget.getBoundingClientRect();
      const x = Number((event.clientX - container.left).toFixed(2));
      const y = Number((event.clientY - container.top).toFixed(2));

      setAddConnectPoint({
        ...addConnectPoint,
        modalOpen: true,
        clickX: x,
        clickY: y,
      });
    }
  };

  return {
    addConnectPoint,
    setAddConnectPoint,
    onAddConnectPoint,
    handleAddConnectPoint,
  };
};

export default useAddConnectPoint;
