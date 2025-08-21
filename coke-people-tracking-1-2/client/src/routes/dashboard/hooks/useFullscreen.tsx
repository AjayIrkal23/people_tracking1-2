import { useEffect, useRef, useContext } from "react";
import { ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch";
import useCalculateCanvasMeasures from "./useCalculateCanvasMeasures";
import MapContext from "@/context/MapContext";

export const useFullscreen = () => {
  const canvas = useCalculateCanvasMeasures();
  // const [isFullScreen, setIsFullScreen] = useState(false);
  const { setIsFullScreen } = useContext(MapContext);
  const ref = useRef<HTMLDivElement | null>(null);
  const transformWrapperRef = useRef<ReactZoomPanPinchContentRef | null>(null);

  const enterFullscreen = () => {
    if (ref.current) {
      if (!document.fullscreenElement) {
        ref.current.requestFullscreen().then(() => setIsFullScreen(true));
      } else {
        document.exitFullscreen().then(() => setIsFullScreen(false));
      }
    }
    if (transformWrapperRef.current) {
      const canvasWidth = canvas.width;
      const screenWidth = window.innerWidth;
      const centerX = (screenWidth - canvasWidth) / 2;

      transformWrapperRef.current.setTransform(centerX, 0, 1);
    }
  };

  const resetCanvasTransform = () => {
    if (transformWrapperRef.current) {
      transformWrapperRef.current.setTransform(0, 0, 1);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullScreen(isCurrentlyFullscreen);

      if (!isCurrentlyFullscreen) {
        resetCanvasTransform();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return { ref, transformWrapperRef, enterFullscreen };
};
