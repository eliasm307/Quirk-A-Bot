import { iNumberTraitData } from '../../traits/interfaces/trait-interfaces';

interface Props {
  data: iNumberTraitData;
  max: number | ((name: string) => number);
  min: number | ((name: string) => number);
}

// todo test

export default function numberTraitIsValid(props: Props): boolean {
  const {
    data: { name, value },
    max,
    min,
  } = props;

  const minVal = typeof min === "number" ? min : min(name);
  const maxVal = typeof max === "number" ? max : max(name);

  const valueIsWithinLimits = value >= minVal && value <= maxVal;

  return valueIsWithinLimits;
}
