import { useState } from "react";
import { BoundingBoxState } from "@/interfaces/device";

const useAddBoundingBox = () => {
  const [addBoundingBox, setAddBoundingBox] = useState<BoundingBoxState>({
    active: false,
    modalOpen: false,
    points: [],
  });
  const [showBoundingBox, setShowBoundingBox] = useState(false);

  const onAddBoundingBox = () => {
    if (addBoundingBox.active) {
      setAddBoundingBox({ ...addBoundingBox, active: false });
    } else {
      setAddBoundingBox({ ...addBoundingBox, active: true });
    }
  };

  const handleAddBoundingBox = (event: React.MouseEvent) => {
    const tagName = (event.target as HTMLElement).tagName;

    if (tagName === "CANVAS" || tagName === "DIV") {
      const container = event.currentTarget.getBoundingClientRect();
      const x = Number((event.clientX - container.left).toFixed(2));
      const y = Number((event.clientY - container.top).toFixed(2));

      if (addBoundingBox.points.length < 8) {
        setAddBoundingBox((prevState) => {
          const newPoints = [...prevState.points, x, y];

          if (newPoints.length === 8) {
            return { ...prevState, points: newPoints, modalOpen: true };
          }

          return { ...prevState, points: newPoints };
        });
      }
    }
  };

  const toggleShowBoundingBox = () => {
    setShowBoundingBox((prev) => !prev);
  };

  return {
    addBoundingBox,
    setAddBoundingBox,
    onAddBoundingBox,
    handleAddBoundingBox,
    showBoundingBox,
    setShowBoundingBox,
    toggleShowBoundingBox,
  };
};

export default useAddBoundingBox;
