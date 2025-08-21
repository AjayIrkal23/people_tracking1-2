import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { handleApiError } from "@/helpers/handleApiError";
import { useState, useEffect, useRef } from "react";
import alarmAudio from "/alarm.mp3";

interface Notification {
  id: number;
  message: string;
  status: string;
}

export const useAlarmNotifications = () => {
  const axiosPrivate = useAxiosPrivate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(alarmAudio);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (notifications.length > 0 && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    } else if (notifications.length === 0 && audioRef.current) {
      audioRef.current.pause();
    }
  }, [notifications]);

  const addNotification = (id: number, message: string, status: string) => {
    setNotifications((prev) => [...prev, { id, message, status }]);
  };

  const removeNotification = async (id: number) => {
    try {
      const res = await axiosPrivate.post("/beacon/reset", {
        bnid: id,
      });
      if (res.status === 200) {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return {
    notifications,
    setNotifications,
    addNotification,
    removeNotification,
  };
};
