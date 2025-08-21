import { useEffect } from "react";
import { Table, theme, DatePicker } from "antd";
import type { TableProps } from "antd";
import { formattedDate } from "@/helpers/formattedDate";
import useViolation from "../hooks/useViolation";
import { Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import { Shift, ViolationType } from "@/interfaces/violation";

import { Dayjs } from "dayjs";

interface DataType {
  key: string;
  bnid: number;
  cpid: number;
  gwid: number;
  violationType: string;
  employeeName: string;
  location: string;
  createdAt: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Beacon ID",
    dataIndex: "bnid",
    key: "bnid",
    align: "center",
  },
  {
    title: "Employee Name",
    dataIndex: "employeeName",
    key: "employeeName",
    align: "center",
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    align: "center",
  },
  {
    title: "Type",
    dataIndex: "violationType",
    key: "violationType",
    align: "center",
    filters: [
      { text: ViolationType.SOS, value: ViolationType.SOS },
      { text: ViolationType.IDLE, value: ViolationType.IDLE },
    ],
    onFilter: (value, record) => record.violationType === value,
  },
  {
    title: "Timestamp",
    dataIndex: "createdAt",
    key: "createdAt",
    align: "center",
  },
  {
    title: "Connect Point ID",
    dataIndex: "cpid",
    key: "cpid",
    align: "center",
  },
  {
    title: "Gateway ID",
    dataIndex: "gwid",
    key: "gwid",
    align: "center",
  },
];

const Violations: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const {
    violations,
    fetchViolations,
    dateRange,
    setDateRange,
    shift,
    setShift,
  } = useViolation();
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    fetchViolations(startDate, endDate, shift);
  }, [fetchViolations, startDate, endDate, shift]);

  const onDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates ?? [null, null]);
  };

  const onShiftChange = (e: RadioChangeEvent) => {
    setShift(e.target.value);
  };

  const transformedData: DataType[] = violations.map((violation) => ({
    key: violation._id,
    bnid: violation.bnid,
    cpid: violation.cpid,
    gwid: violation.gwid,
    violationType: violation.violationType,
    employeeName: violation.employeeName,
    location: violation.location,
    createdAt: formattedDate(violation.createdAt),
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
        <Radio.Group
          onChange={onShiftChange}
          value={shift}
          className="shadow-md rounded-md p-2 bg-white"
        >
          <Radio.Button value={Shift.A}>A Shift</Radio.Button>
          <Radio.Button value={Shift.B}>B Shift</Radio.Button>
          <Radio.Button value={Shift.C}>C Shift</Radio.Button>
          <Radio.Button value={Shift.F}>Full Day</Radio.Button>
        </Radio.Group>
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

export default Violations;
