import { useEffect } from "react";
import { Table, theme, DatePicker, Select } from "antd";
import type { TableProps } from "antd";
import { formattedDate } from "@/helpers/formattedDate";
import useLogs from "../hooks/useLogs";
import { Dayjs } from "dayjs";
import { EventType } from "@/interfaces/logs";

interface DataType {
  key: string;
  eventType: string;
  createdAt: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Event Type",
    dataIndex: "eventType",
    key: "eventType",
    align: "center",
  },
  {
    title: "Timestamp",
    dataIndex: "createdAt",
    key: "createdAt",
    align: "center",
  },
];

const Logs: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { logs, fetchLogs, dateRange, setDateRange, eventType, setEventType } =
    useLogs();
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    fetchLogs(startDate, endDate, eventType);
  }, [fetchLogs, startDate, endDate, eventType]);

  const onDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates ?? [null, null]);
  };

  const handleEventTypeChange = (value: EventType) => {
    setEventType(value);
  };

  const transformedData: DataType[] = logs.map((log) => ({
    key: log._id,
    eventType: log.eventType,
    createdAt: formattedDate(log.createdAt),
  }));

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <DatePicker.RangePicker
          onChange={onDateChange}
          className="shadow-md rounded-md"
        />
        <Select
          value={eventType}
          onChange={handleEventTypeChange}
          style={{ width: 240 }}
          className="shadow-md rounded-md"
          placeholder="Select event type"
          allowClear
          options={[
            {
              value: EventType.BEACON_TO_CONNECT_POINT,
              label: "Beacon To Connect Point",
            },
            {
              value: EventType.BEACON_TO_DCS_DEVICE,
              label: "Beacon To DCS Device",
            },
            {
              value: EventType.CONNECT_POINT_HEARTBEAT,
              label: "Connect Point Heartbeat",
            },
            {
              value: EventType.DCS_DEVICE_HEARTBEAT,
              label: "DCS Device Heartbeat",
            },
            { value: EventType.GATEWAY_HEARTBEAT, label: "Gateway Heartbeat" },
          ]}
        />
      </div>
      <Table
        columns={columns}
        dataSource={transformedData}
        className="shadow-md rounded-md"
        style={{
          background: colorBgContainer,
        }}
      />
    </>
  );
};

export default Logs;
