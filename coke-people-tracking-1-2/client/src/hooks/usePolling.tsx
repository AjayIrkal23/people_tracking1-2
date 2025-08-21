import { useEffect } from "react";

export function usePolling(callback: () => void, interval: number) {
  useEffect(() => {
    callback(); // Initial fetch
    const id = setInterval(callback, interval);
    return () => clearInterval(id);
  }, [callback, interval]);
}
