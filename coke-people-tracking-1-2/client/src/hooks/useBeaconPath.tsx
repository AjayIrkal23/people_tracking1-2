import { useState, useCallback } from "react";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { handleApiError } from "@/helpers/handleApiError";
import { BeaconPath } from "@/interfaces/device";
import { Battery } from "@/interfaces/map";

const useBeaconPath = () => {
  const axiosPrivate = useAxiosPrivate();
  const [path, setPath] = useState<BeaconPath[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPath = useCallback(
    async (bnid: number, date: string, battery: Battery) => {
      try {
        setLoading(true);
        const res = await axiosPrivate.get<BeaconPath[]>("/beacon/path", {
          params: { bnid, date, battery },
        });
        setPath(res.data);
        return res.data;
      } catch (error) {
        handleApiError(error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [axiosPrivate]
  );

  return { path, loading, fetchPath };
};

export default useBeaconPath;
