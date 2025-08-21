import React from "react";
import { Button, Tooltip, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ConnectPoint } from "@/interfaces/device";

interface ConnectPointActionsProps {
  connectPoint: ConnectPoint;
  onDeleteConnectPoint: (cpid: number) => void;
}

const ConnectPointActions: React.FC<ConnectPointActionsProps> = ({
  connectPoint,
  onDeleteConnectPoint,
}) => {
  return (
    <Space size="middle">
      <Tooltip title="Delete Connect Point">
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => onDeleteConnectPoint(connectPoint.cpid)}
        />
      </Tooltip>
    </Space>
  );
};

export default ConnectPointActions;
