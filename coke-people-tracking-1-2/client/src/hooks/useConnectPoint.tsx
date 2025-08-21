import { useState, useEffect, useCallback, useContext } from "react";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { handleApiError } from "@/helpers/handleApiError";
import { ConnectPoint } from "@/interfaces/device";
import MapContext from "@/context/MapContext";

const useConnectPoint = () => {
  const { location } = useContext(MapContext);
  const axiosPrivate = useAxiosPrivate();
  const [connectPoints, setConnectPoints] = useState<ConnectPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnectPoints = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get<ConnectPoint[]>(
        `/connectPoint?location=${location}`
      );
      setConnectPoints(response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchConnectPoints();
  }, [fetchConnectPoints]);

  return { connectPoints, loading, fetchConnectPoints };
};

export default useConnectPoint;
