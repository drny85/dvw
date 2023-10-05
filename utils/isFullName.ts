export function isFullName(value: string): boolean {
  if (typeof value === "string") {
    // Split the string into parts by whitespace
    const parts = value.trim().split(" ");

    // Check if there are exactly two parts (first name and last name)
    return parts.length === 2 && parts.every((part) => part.length > 0);
  }

  return false;
}
