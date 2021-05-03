export function createObjectAlphabeticalSorter<
  T extends Record<string, unknown>
>(sortField: keyof T) {
  return (a: T, b: T) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    // default sorting if fields arent arrays
    if (typeof valueA !== "string" || typeof valueB !== "string")
      return valueA < valueB;

    // alphabetical sorting
    return valueA.localeCompare(valueB);
  };
}
