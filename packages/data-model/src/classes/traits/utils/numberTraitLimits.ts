import { CoreNumberTraitName } from 'packages/common/src/declarations';

export function coreNumberTraitMax(name: CoreNumberTraitName): number {
  const limits: Record<CoreNumberTraitName, number> = {
    "Blood Potency": 10,
    Health: 10,
    Humanity: 10,
    Hunger: 5,
    Willpower: 10,
  };

  return limits[name];
}

export function coreNumberTraitMin(name: CoreNumberTraitName): number {
  return 0;
}
