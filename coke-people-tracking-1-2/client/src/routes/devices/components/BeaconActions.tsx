import React from "react";
import useAuth from "@/hooks/auth/useAuth";
import { Button, Tooltip, Space } from "antd";
import { UserAddOutlined, DeleteOutlined } from "@ant-design/icons";
import { Beacon } from "@/interfaces/device";

interface BeaconActionsProps {
  beacon: Beacon;
  onAssignEmployee: (bnid: number) => void;
  onDeleteBeacon: (bnid: number) => void;
}

const BeaconActions: React.FC<BeaconActionsProps> = ({
  beacon,
  onAssignEmployee,
  onDeleteBeacon,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <Space size="middle">
      <Tooltip title="Assign Employee">
        <Button
          icon={<UserAddOutlined />}
          onClick={() => onAssignEmployee(beacon.bnid)}
        />
      </Tooltip>
      {isAdmin && (
        <Tooltip title="Delete Beacon">
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDeleteBeacon(beacon.bnid)}
          />
        </Tooltip>
      )}
    </Space>
  );
};

export default BeaconActions;
