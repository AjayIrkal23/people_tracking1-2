export function getRandomColor() {
  // Define a range of values for dark colors
  const minValue = 32; // Minimum value (inclusive)
  const maxValue = 128; // Maximum value (exclusive)

  // Generate random RGB values within the dark color range
  const r = Math.floor(Math.random() * (maxValue - minValue)) + minValue;
  const g = Math.floor(Math.random() * (maxValue - minValue)) + minValue;
  const b = Math.floor(Math.random() * (maxValue - minValue)) + minValue;

  // Convert RGB values to a hexadecimal color code
  const hexColor =
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0");

  return hexColor;
}
