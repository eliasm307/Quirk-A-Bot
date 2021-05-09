export default function displayNameToPropertyName(displayName: string): string {
  // remove all spaces
  const noSpaces = displayName.replace(/\s/g, "");

  // todo this could also handle special characters?

  // make first letter lower case
  return noSpaces.charAt(0).toLowerCase() + noSpaces.slice(1);
}
