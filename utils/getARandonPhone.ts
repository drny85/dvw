export function getRandomValueFromArray<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined; // Return undefined for empty arrays
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
