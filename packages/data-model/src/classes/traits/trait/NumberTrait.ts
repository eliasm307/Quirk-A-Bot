import { TraitNameUnionOrString } from '../../../declarations/types';
import { iNumberTrait, iNumberTraitData, iNumberTraitProps } from '../interfaces/trait-interfaces';
import AbstractNumberTrait from './AbstractNumberTrait';

/** class with behaviour for traits that have number values */
export default class NumberTrait<N extends TraitNameUnionOrString>
  extends AbstractNumberTrait<N, iNumberTraitData<N>>
  implements iNumberTrait<N> {
  constructor({
    min = 0,
    value = min,

    ...restProps
  }: iNumberTraitProps<N>) {
    super({
      ...restProps,
      value,
      data: () => ({
        name: this.name,
        value: this.value,
      }),
      min,
    });
  }
}
