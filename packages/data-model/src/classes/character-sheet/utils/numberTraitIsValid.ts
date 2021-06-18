import { TraitNameUnionOrString } from 'packages/common/src/declarations';

import { iNumberTraitData } from '../../traits/interfaces/trait-interfaces';

type LimitDefinition<N extends TraitNameUnionOrString> =
  | number
  | ((name: N) => number)
  | { [Key in N]: number };

interface Props<N extends TraitNameUnionOrString> {
  data: iNumberTraitData<N>;
  max: LimitDefinition<N>;
  min: LimitDefinition<N>;
}

const getNumberFromLimitDefinition = <N extends TraitNameUnionOrString>(
  limit: LimitDefinition<N>,
  name: N
): number => {
  if (typeof limit === "number") return limit;

  if (typeof limit === "function") return limit(name);

  return limit[name];
};

// todo test

export default function numberTraitIsValid<N extends TraitNameUnionOrString>(
  props: Props<N>
): boolean {
  const {
    data: { name, value },
    max,
    min,
  } = props;

  const minVal = getNumberFromLimitDefinition(min, name);
  const maxVal = getNumberFromLimitDefinition(max, name);

  const valueIsWithinLimits = value >= minVal && value <= maxVal;

  return valueIsWithinLimits;
}
