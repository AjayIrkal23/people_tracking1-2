export function getRandomPoint(
  coordinates: number[],
  width: number,
  height: number
) {
  const pixelBoundingBox = coordinates.map((value, index) =>
    index % 2 === 0 ? value * width : value * height
  );

  // Validate input array length
  if (pixelBoundingBox.length !== 8 || pixelBoundingBox.length % 2 !== 0) {
    throw new Error(
      "Invalid input array. Expected an array of 8 coordinates (4 x-y pairs)."
    );
  }

  // Extract the minimum and maximum x and y values from the coordinates array
  const minX = Math.min(
    ...pixelBoundingBox.filter((_, index) => index % 2 === 0)
  );
  const maxX = Math.max(
    ...pixelBoundingBox.filter((_, index) => index % 2 === 0)
  );
  const minY = Math.min(
    ...pixelBoundingBox.filter((_, index) => index % 2 !== 0)
  );
  const maxY = Math.max(
    ...pixelBoundingBox.filter((_, index) => index % 2 !== 0)
  );

  // Adjust the bounding box to be 20 pixels smaller
  const adjustedMinX = minX + 25;
  const adjustedMaxX = maxX - 25;
  const adjustedMinY = minY + 25;
  const adjustedMaxY = maxY - 25;

  // Generate a random x and y value within the adjusted bounding box
  const randomX = adjustedMinX + Math.random() * (adjustedMaxX - adjustedMinX);
  const randomY = adjustedMinY + Math.random() * (adjustedMaxY - adjustedMinY);
  const normalizedRandomX = randomX / width;
  const normalizedRandomY = randomY / height;

  return { normalizedRandomX, normalizedRandomY };
}
