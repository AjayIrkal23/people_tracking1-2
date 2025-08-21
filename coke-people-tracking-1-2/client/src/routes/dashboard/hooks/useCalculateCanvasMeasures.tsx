import { useState, useEffect } from "react";

const useCalculateCanvasMeasures = () => {
  const calculateMeasures = () => {
    const maxWidth = window.innerWidth - 250;
    const maxHeight = window.innerHeight;
    const aspectRatio = maxWidth / maxHeight;

    if (aspectRatio > 1) {
      // Landscape mode
      return {
        width: maxHeight * aspectRatio,
        height: maxHeight,
      };
    } else {
      // Portrait mode
      return {
        width: maxWidth,
        height: maxWidth / aspectRatio,
      };
    }
  };

  const [dimensions, setDimensions] = useState(calculateMeasures());

  useEffect(() => {
    const handleResize = () => setDimensions(calculateMeasures());

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return dimensions;
};

export default useCalculateCanvasMeasures;
