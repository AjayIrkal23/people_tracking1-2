import { useState } from "react";
import { AddDeviceOnMapType } from "@/interfaces/device";

const useAddGateway = () => {
  const [addGateway, setAddGateway] = useState<AddDeviceOnMapType>({
    active: false,
    modalOpen: false,
    clickX: 0,
    clickY: 0,
  });

  const onAddGateway = () => {
    if (addGateway.active) {
      setAddGateway({ ...addGateway, active: false });
    } else {
      setAddGateway({ ...addGateway, active: true });
    }
  };

  const handleAddGateway = (event: React.MouseEvent) => {
    const tagName = (event.target as HTMLElement).tagName;
    if (tagName === "CANVAS" || tagName === "DIV") {
      const container = event.currentTarget.getBoundingClientRect();
      const x = Number((event.clientX - container.left).toFixed(2));
      const y = Number((event.clientY - container.top).toFixed(2));

      setAddGateway({ ...addGateway, modalOpen: true, clickX: x, clickY: y });
    }
  };

  return { addGateway, setAddGateway, onAddGateway, handleAddGateway };
};

export default useAddGateway;
