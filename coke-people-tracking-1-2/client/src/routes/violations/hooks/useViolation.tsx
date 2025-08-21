import { useState, useCallback } from "react";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { Dayjs } from "dayjs";
import { handleApiError } from "@/helpers/handleApiError";
import { Shift, Violation } from "@/interfaces/violation";

const useViolation = () => {
  const axiosPrivate = useAxiosPrivate();
  const [violations, setViolations] = useState<Violation[]>([]);
  const [shift, setShift] = useState<Shift>(Shift.F); // default is full day
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  const fetchViolations = useCallback(
    async (startDate: Dayjs | null, endDate: Dayjs | null, shift: Shift) => {
      try {
        const response = await axiosPrivate.get(`/violation/all`, {
          params: {
            startDate: startDate ? startDate.toISOString() : undefined,
            endDate: endDate ? endDate.toISOString() : undefined,
            shift,
          },
        });
        setViolations(response.data);
      } catch (error) {
        handleApiError(error);
      }
    },
    [dateRange, shift]
  );

  return {
    violations,
    fetchViolations,
    dateRange,
    setDateRange,
    shift,
    setShift,
  };
};

export default useViolation;
