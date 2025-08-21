import { useState, useCallback } from "react";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { Dayjs } from "dayjs";
import { handleApiError } from "@/helpers/handleApiError";
import { EventType, Log } from "@/interfaces/logs";

const useLogs = () => {
  const axiosPrivate = useAxiosPrivate();
  const [logs, setLogs] = useState<Log[]>([]);
  const [eventType, setEventType] = useState<EventType | undefined>();
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  const fetchLogs = useCallback(
    async (
      startDate?: Dayjs | null,
      endDate?: Dayjs | null,
      eventType?: EventType
    ) => {
      try {
        const response = await axiosPrivate.get(`/logs/fetch`, {
          params: {
            startDate: startDate ? startDate.toISOString() : undefined,
            endDate: endDate ? endDate.toISOString() : undefined,
            eventType,
          },
        });

        setLogs(response.data.data);
      } catch (error) {
        handleApiError(error);
      }
    },
    [dateRange, eventType]
  );

  return {
    logs,
    fetchLogs,
    dateRange,
    setDateRange,
    eventType,
    setEventType,
  };
};

export default useLogs;
