import React from "react";
import { Table, theme } from "antd";
import type { TableProps } from "antd";
import { Gateway, DeleteGatewayType } from "@/interfaces/device";
import useAuth from "@/hooks/auth/useAuth";
import GatewayActions from "./GatewayActions";

interface DataType {
  key: number;
  gwid: number;
  location: string;
  side: string;
  connectPoints: number;
}

interface GatewaysTableProps {
  gateways: Gateway[];
  loading: boolean;
  fetchGateways: () => void;
  setDeleteGateway: React.Dispatch<React.SetStateAction<DeleteGatewayType>>;
}

const GatewaysTable: React.FC<GatewaysTableProps> = ({
  gateways,
  loading,
  setDeleteGateway,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const onDeleteGateway = (gwid: number) =>
    setDeleteGateway({ open: true, gwid });

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Gateway ID",
      dataIndex: "gwid",
      key: "gwid",
      align: "center",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
    },
    {
      title: "Side",
      dataIndex: "side",
      key: "side",
      align: "center",
    },
    {
      title: "Connect Points",
      dataIndex: "connectPoints",
      key: "connectPoints",
      align: "center",
    },
    ...(isAdmin
      ? [
          {
            title: "Action",
            key: "action",
            align: "center" as const,
            render: (_: any, record: DataType) => {
              const selectedGateway = gateways.find(
                (gateway) => gateway.gwid === record.key
              );
              return (
                selectedGateway && (
                  <GatewayActions
                    gateway={selectedGateway}
                    onDeleteGateway={onDeleteGateway}
                  />
                )
              );
            },
          },
        ]
      : []),
  ];

  const transformedData: DataType[] = gateways.map((gateway) => ({
    key: gateway.gwid,
    gwid: gateway.gwid,
    location: gateway.location,
    side: gateway.side,
    connectPoints: gateway.connectPoints?.length ?? 0,
  }));

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={transformedData}
      className="shadow-md rounded-md mt-5"
      scroll={{ y: "45vh" }}
      style={{
        background: colorBgContainer,
      }}
    />
  );
};

export default GatewaysTable;
