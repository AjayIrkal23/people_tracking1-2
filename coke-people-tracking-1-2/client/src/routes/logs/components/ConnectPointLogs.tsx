import React, { useState, useEffect } from "react";
import { Table, DatePicker, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { handleApiError } from "@/helpers/handleApiError";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Define types for table data
interface TableDataItem {
  key: number;
  cpid: number;
  hourlyActivity: boolean[];
}

// Define types for API response
interface LogsResponse {
  date: string;
  cpids: {
    [key: string]: boolean[];
  };
}

// Simplified time labels
const HOUR_LABELS: string[] = [
  "12-1AM",
  "1-2AM",
  "2-3AM",
  "3-4AM",
  "4-5AM",
  "5-6AM",
  "6-7AM",
  "7-8AM",
  "8-9AM",
  "9-10AM",
  "10-11AM",
  "11-12PM",
  "12-1PM",
  "1-2PM",
  "2-3PM",
  "3-4PM",
  "4-5PM",
  "5-6PM",
  "6-7PM",
  "7-8PM",
  "8-9PM",
  "9-10PM",
  "10-11PM",
  "11-12AM",
];

// Default CPIDs to display
const DEFAULT_CPIDS: number[] = [
  ...Array.from({ length: 7 }, (_, i) => 101 + i),
  ...Array.from({ length: 7 }, (_, i) => 109 + i),
  ...Array.from({ length: 7 }, (_, i) => 151 + i),
  ...Array.from({ length: 7 }, (_, i) => 159 + i),
];

const ConnectPointLogsTable: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState<TableDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  // Fetch logs for selected date
  const fetchLogs = async (date: Dayjs | null): Promise<void> => {
    if (!date) {
      setData([]);
      setSelectedDate(null);
      return;
    }

    try {
      setLoading(true);
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedDate(date);

      const response = await axiosPrivate.get<LogsResponse>(
        `/connectPoint/logs?date=${formattedDate}`
      );
      const { cpids } = response.data;

      const tableData: TableDataItem[] = DEFAULT_CPIDS.map((cpid) => {
        const hourlyActivity = cpids[cpid.toString()] || Array(24).fill(false);
        return { key: cpid, cpid, hourlyActivity };
      });

      setData(tableData);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Export to Excel function
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ConnectPointLogs");

    // Define pastel colors
    const COLORS = {
      ACTIVE: "C8E6C9", // soft green
      INACTIVE: "FFCDD2", // soft red
      FUTURE: "BBDEFB", // soft blue
    };

    // Add header row
    const headerRow = worksheet.addRow(["CPID", ...HOUR_LABELS]);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add data rows
    data.forEach((item) => {
      const row = worksheet.addRow([
        item.cpid,
        ...item.hourlyActivity.map((active, i) => {
          const isCurrentDay = selectedDate?.isSame(dayjs(), "day");
          const currentHour = dayjs().hour();
          if (isCurrentDay && i > currentHour) return "FUTURE";
          return active ? "ACTIVE" : "INACTIVE";
        }),
      ]);

      row.eachCell((cell, colIndex) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        if (colIndex === 1) return; // Skip CPID column

        const value = cell.value?.toString();
        if (value === "ACTIVE") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: COLORS.ACTIVE },
          };
        } else if (value === "INACTIVE") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: COLORS.INACTIVE },
          };
        } else if (value === "FUTURE") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: COLORS.FUTURE },
          };
        }

        // Remove the text value — leave just color
        cell.value = "";
      });
    });

    // Auto width
    worksheet.columns.forEach((col) => {
      col.width = 10;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `ConnectPointLogs_${selectedDate?.format("YYYY-MM-DD")}.xlsx`);
  };

  // Fetch on mount
  useEffect(() => {
    if (selectedDate) {
      fetchLogs(selectedDate);
    }
  }, []);

  // Columns definition
  const columns: ColumnsType<TableDataItem> = [
    {
      title: "CPID",
      dataIndex: "cpid",
      key: "cpid",
      fixed: "left",
      render: (text: number) => <b>{text}</b>,
    },
    ...HOUR_LABELS.map((label, index) => ({
      title: label,
      key: `hour-${index}`,
      width: 80,
      render: (record: TableDataItem) => {
        const isCurrentDay = selectedDate?.isSame(dayjs(), "day");
        const currentHour = dayjs().hour();
        if (isCurrentDay && index > currentHour) return "🔵";
        return record.hourlyActivity[index] ? "🟢" : "🔴";
      },
    })),
  ];

  return (
    <div>
      <DatePicker
        onChange={fetchLogs}
        style={{ marginBottom: 16 }}
        allowClear={false}
        value={selectedDate}
      />
      <Button
        type="primary"
        onClick={exportToExcel}
        style={{ marginBottom: 16, marginLeft: 8 }}
        disabled={data.length === 0}
      >
        Download Excel
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        bordered
        scroll={{ x: "max-content" }}
        size="small"
      />
    </div>
  );
};

export default ConnectPointLogsTable;
