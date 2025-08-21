import React from "react";
import { Table, theme } from "antd";
import type { TableProps } from "antd";
import {
  Beacon,
  DeleteBeaconType,
  AssignEmployeeType,
} from "@/interfaces/device";
import { getLastActive } from "@/helpers/getLastActive";
import BeaconBatteryTag from "../../../components/BeaconBatteryTag";
import BeaconActions from "./BeaconActions";

interface DataType {
  key: number;
  bnid: number;
  lastActive: string;
  battery: string;
  assignedEmployee: string;
  employeeLastAssigned: string;
}

interface BeaconsTableProps {
  beacons: Beacon[];
  loading: boolean;
  fetchBeacons: () => void;
  setDeleteBeacon: React.Dispatch<React.SetStateAction<DeleteBeaconType>>;
  setAssignEmployee: React.Dispatch<React.SetStateAction<AssignEmployeeType>>;
}

const BeaconsTable: React.FC<BeaconsTableProps> = ({
  beacons,
  loading,
  setDeleteBeacon,
  setAssignEmployee,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onAssignEmployee = (bnid: number) =>
    setAssignEmployee({ open: true, bnid });

  const onDeleteBeacon = (bnid: number) =>
    setDeleteBeacon({ open: true, bnid });

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Beacon ID",
      dataIndex: "bnid",
      key: "bnid",
      align: "center",
    },

    {
      title: "Battery",
      dataIndex: "battery",
      key: "battery",
      align: "center",
      render: (battery: string) => <BeaconBatteryTag battery={battery} />,
    },
    {
      title: "Assigned Employee",
      dataIndex: "assignedEmployee",
      key: "assignedEmployee",
      align: "center",
      render: (_: any, record: DataType) => {
        return record.assignedEmployee === "Unassigned" ? (
          <span className="text-red-500">{record.assignedEmployee}</span>
        ) : (
          <span>{record.assignedEmployee}</span>
        );
      },
    },
    {
      title: "Employee Last Assigned",
      dataIndex: "employeeLastAssigned",
      key: "employeeLastAssigned",
      align: "center",
    },
    {
      title: "Employee Last Seen",
      dataIndex: "lastActive",
      key: "lastActive",
      align: "center",
    },

    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_: any, record: DataType) => {
        const selectedBeacon = beacons.find(
          (beacon) => beacon.bnid === record.key
        );
        return (
          selectedBeacon && (
            <BeaconActions
              beacon={selectedBeacon}
              onAssignEmployee={onAssignEmployee}
              onDeleteBeacon={onDeleteBeacon}
            />
          )
        );
      },
    },
  ];

  const transformedData: DataType[] = beacons.map((beacon) => ({
    key: beacon.bnid,
    bnid: beacon.bnid,
    lastActive: getLastActive(beacon.lastActive),
    employeeLastAssigned: getLastActive(beacon.employeeLastAssigned),
    battery: String(beacon.battery),
    assignedEmployee: beacon.assignedEmployee,
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

export default BeaconsTable;
