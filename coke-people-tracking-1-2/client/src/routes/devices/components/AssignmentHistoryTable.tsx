import React from "react";
import { Table, theme } from "antd";
import type { TableProps } from "antd";
import { AssignmentHistory } from "@/interfaces/device";
import { formattedDate } from "@/helpers/formattedDate";

interface AssignmentHistoryTableProps {
  assignmentHistory: AssignmentHistory[];
  loading: boolean;
}

interface DataType {
  key: string;
  bnid: number;
  employee: string;
  assignedAt: string;
}

const AssignmentHistoryTable: React.FC<AssignmentHistoryTableProps> = ({
  assignmentHistory,
  loading,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Beacon ID",
      dataIndex: "bnid",
      key: "bnid",
      align: "center",
    },
    {
      title: "Employee",
      dataIndex: "employee",
      key: "employee",
      align: "center",
      render: (employee: string) => {
        return employee === "Unassigned" ? (
          <span className="text-red-500">{employee}</span>
        ) : (
          <span>{employee}</span>
        );
      },
    },
    {
      title: "Assigned At",
      dataIndex: "assignedAt",
      key: "assignedAt",
      align: "center",
      render: (assignedAt: Date) => formattedDate(assignedAt),
    },
  ];

  const transformedData: DataType[] = assignmentHistory.map((history) => ({
    key: history._id,
    bnid: history.bnid,
    employee: history.employee,
    assignedAt: history.assignedAt,
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
      pagination={{
        pageSize: 10,
      }}
    />
  );
};

export default AssignmentHistoryTable;
