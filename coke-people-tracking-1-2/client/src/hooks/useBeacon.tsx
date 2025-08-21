import { useState, useEffect, useCallback, useContext } from "react";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { handleApiError } from "@/helpers/handleApiError";
import { Beacon } from "@/interfaces/device";
import MapContext from "@/context/MapContext";

const useBeacon = () => {
  const axiosPrivate = useAxiosPrivate();
  const { location } = useContext(MapContext);
  const [beacons, setBeacons] = useState<Beacon[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBeacons = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get<Beacon[]>(
        `/beacon?location=${location}`
      );
      setBeacons(response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchBeacons();
  }, [fetchBeacons]);

  return { beacons, loading, fetchBeacons };
};

export default useBeacon;
