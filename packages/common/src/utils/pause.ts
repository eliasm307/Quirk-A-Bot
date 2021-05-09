/** A promise that resolves after a given number of milliseconds */
export default async function pause(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
