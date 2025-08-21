function formattedDate(date: Date) {
  if (date) {
    const formatted = new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return formatted;
  }

  const formatted = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return formatted;
}

export { formattedDate };
