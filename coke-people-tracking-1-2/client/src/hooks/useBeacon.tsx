import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { handleApiError } from "@/helpers/handleApiError";
import { Beacon } from "@/interfaces/device";
import { Battery } from "@/interfaces/map";

const useBeacon = () => {
  const axiosPrivate = useAxiosPrivate();
  const [beacons, setBeacons] = useState<Beacon[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBeacons = useCallback(async () => {
    try {
      setLoading(true);
      const [batteryOne, batteryTwo] = await Promise.all([
        axiosPrivate.get<Beacon[]>(`/beacon?location=${Battery.one}`),
        axiosPrivate.get<Beacon[]>(`/beacon?location=${Battery.two}`),
      ]);
      setBeacons([...batteryOne.data, ...batteryTwo.data]);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchBeacons();
  }, [fetchBeacons]);

  return { beacons, loading, fetchBeacons };
};

export default useBeacon;
