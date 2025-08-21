import React from "react";
import { Button, Tooltip, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Gateway } from "@/interfaces/device";

interface GatewayActionsProps {
  gateway: Gateway;
  onDeleteGateway: (gwid: number) => void;
}

const GatewayActions: React.FC<GatewayActionsProps> = ({
  gateway,
  onDeleteGateway,
}) => {
  return (
    <Space size="middle">
      <Tooltip title="Delete Gateway">
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => onDeleteGateway(gateway.gwid)}
        />
      </Tooltip>
    </Space>
  );
};

export default GatewayActions;
