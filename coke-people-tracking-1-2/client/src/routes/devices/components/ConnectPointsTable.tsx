import React from "react";
import { Table, theme } from "antd";
import type { TableProps } from "antd";
import { ConnectPoint, DeleteConnectPointType } from "@/interfaces/device";
import ConnectPointActions from "./ConnectPointActions";
import useAuth from "@/hooks/auth/useAuth";

interface DataType {
  key: number;
  cpid: number;
  range: string;
  parentGateway: number | string;
  location: string;
  side: string;
}

interface ConnectPointsTableProps {
  connectPoints: ConnectPoint[];
  loading: boolean;
  fetchConnectPoints: () => void;
  setDeleteConnectPoint: React.Dispatch<
    React.SetStateAction<DeleteConnectPointType>
  >;
}

const ConnectPointsTable: React.FC<ConnectPointsTableProps> = ({
  connectPoints,
  loading,
  setDeleteConnectPoint,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const onDeleteConnectPoint = (cpid: number) =>
    setDeleteConnectPoint({ open: true, cpid });

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Connect Point ID",
      dataIndex: "cpid",
      key: "cpid",
      align: "center",
    },
    {
      title: "Parent Gateway",
      dataIndex: "parentGateway",
      key: "parentGateway",
      align: "center",
      render: (_: any, record: DataType) => {
        return record.parentGateway === "Unassigned" ? (
          <span className="text-red-500">{record.parentGateway}</span>
        ) : (
          <span>{record.parentGateway}</span>
        );
      },
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
      render: (_: any, record: DataType) => {
        return record.location === "Unassigned" ? (
          <span className="text-red-500">{record.location}</span>
        ) : (
          <span>{record.location}</span>
        );
      },
    },
    {
      title: "Side",
      dataIndex: "side",
      key: "side",
      align: "center",
      render: (_: any, record: DataType) => {
        return record.location === "Unassigned" ? (
          <span className="text-red-500">{record.side}</span>
        ) : (
          <span>{record.side}</span>
        );
      },
    },
    {
      title: "Range",
      dataIndex: "range",
      key: "range",
      align: "center",
    },
    ...(isAdmin
      ? [
          {
            title: "Action",
            key: "action",
            align: "center" as const,
            render: (_: any, record: DataType) => {
              const selectedConnectPoint = connectPoints.find(
                (connectPoint) => connectPoint.cpid === record.key
              );
              return (
                selectedConnectPoint && (
                  <ConnectPointActions
                    connectPoint={selectedConnectPoint}
                    onDeleteConnectPoint={onDeleteConnectPoint}
                  />
                )
              );
            },
          },
        ]
      : []),
  ];

  const transformedData: DataType[] = connectPoints.map((connectPoint) => ({
    key: connectPoint.cpid,
    cpid: connectPoint.cpid,
    range: `Pillar ${connectPoint.range.pillarStart} to ${connectPoint.range.pillarEnd}`,
    parentGateway: connectPoint.parentGateway?.gwid ?? "Unassigned",
    location: connectPoint?.parentGateway?.location ?? "Unassigned",
    side: connectPoint?.parentGateway?.side ?? "Unassigned",
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

export default ConnectPointsTable;
