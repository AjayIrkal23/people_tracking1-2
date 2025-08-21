import { useState, useEffect, useCallback, useContext } from "react";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { handleApiError } from "@/helpers/handleApiError";
import { Gateway } from "@/interfaces/device";
import MapContext from "@/context/MapContext";

const useGateway = () => {
  const { location } = useContext(MapContext);
  const axiosPrivate = useAxiosPrivate();
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGateways = useCallback(async () => {
    console.log(location);
    try {
      setLoading(true);
      const response = await axiosPrivate.get<Gateway[]>(
        `/gateway?location=${location}`
      );
      setGateways(response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchGateways();
  }, [fetchGateways]);

  return { gateways, loading, fetchGateways };
};

export default useGateway;
