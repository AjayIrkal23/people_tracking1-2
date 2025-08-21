// hooks/useAssignmentHistory.ts
import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { handleApiError } from "@/helpers/handleApiError";
import { AssignmentHistory } from "@/interfaces/device";

const useAssignmentHistory = () => {
  const axiosPrivate = useAxiosPrivate();
  const [assignmentHistory, setAssignmentHistory] = useState<
    AssignmentHistory[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignmentHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get<AssignmentHistory[]>(
        `/beacon/assignmentHistory`
      );
      setAssignmentHistory(response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignmentHistory();
  }, [fetchAssignmentHistory]);

  return { assignmentHistory, loading, fetchAssignmentHistory };
};

export default useAssignmentHistory;
