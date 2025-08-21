import React from "react";
import { Space, Table, theme, Tag } from "antd";
import type { TableProps } from "antd";
import { User } from "@/interfaces/user";
import { formattedDate } from "@/helpers/formattedDate";

interface DataType {
  key: string;
  name: string;
  email: string;
  role: string;
  registeredOn: string;
}

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onRefresh: () => void;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role: string) => {
      const color = role === "ADMIN" ? "green" : "orange";
      return (
        <Tag color={color} key={role}>
          {role}
        </Tag>
      );
    },
  },
  {
    title: "Registered On",
    dataIndex: "registeredOn",
    key: "registeredOn",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a onClick={() => console.log(`Delete user with key: ${record.key}`)}>
          Reset Password
        </a>
        <a onClick={() => console.log(`Delete user with key: ${record.key}`)}>
          Delete
        </a>
      </Space>
    ),
  },
];

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  //   onRefresh,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const data: DataType[] = users.map((user) => ({
    key: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    registeredOn: formattedDate(user.createdAt),
  }));

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        className="shadow-md rounded-md"
        style={{
          background: colorBgContainer,
        }}
      />
    </>
  );
};

export default UsersTable;
