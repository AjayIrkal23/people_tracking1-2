export const getNormalizedCoordinates = (
  axis: "x-axis" | "y-axis",
  pixels: number,
  canvasMeasures: { width: number; height: number }
) => {
  if (axis === "x-axis") {
    return pixels / canvasMeasures.width;
  } else if (axis === "y-axis") {
    return pixels / canvasMeasures.height;
  } else {
    throw new Error(`Unsupported axis: ${axis}`);
  }
};
