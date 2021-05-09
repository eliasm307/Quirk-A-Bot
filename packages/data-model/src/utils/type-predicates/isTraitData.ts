import { iGeneralTraitData } from '../../classes/traits/interfaces/trait-interfaces';

export default function isTraitData<
  T extends iGeneralTraitData = iGeneralTraitData
>(data: unknown): data is T {
  if (typeof data !== "object") return false;
  if (!data) return false;

  const { name, value } = data as iGeneralTraitData;

  const nameExists = typeof name === "string";
  const valueExists = typeof value === "string" || typeof value === "number";
  const onlyHas2Properties = Object.keys(data).length === 2;

  if (nameExists && valueExists && onlyHas2Properties) {
    return true;
  }
  // console.log(`Object is not valid trait data`, { data, nameExists, valueExists, onlyHas2Properties });
  return false;
}
