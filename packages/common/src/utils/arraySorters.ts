export function createObjectAlphabeticalSorter<T>(sortField: keyof T) {
  return (a: T, b: T) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    // default sorting if fields arent arrays
    if (typeof valueA !== "string" || typeof valueB !== "string") return 0; //default return value (no sorting)

    // alphabetical sorting
    return valueA.localeCompare(valueB);
  };
}
