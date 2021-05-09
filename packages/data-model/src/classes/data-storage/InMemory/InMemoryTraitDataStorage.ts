import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import { iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';
import { iBaseTraitDataStorage } from '../interfaces/data-storage-interfaces';
import { iBaseTraitDataStorageProps } from '../interfaces/props/trait-data-storage';
import { createPath } from '../utils/createPath';

export default class InMemoryTraitDataStorage<
    N extends TraitNameUnionOrString,
    V extends TraitValueTypeUnion
  >
  extends AbstractTraitDataStorage<N, V>
  implements iBaseTraitDataStorage<N, V> {
  path: string;

  constructor(props: iBaseTraitDataStorageProps<N, V>) {
    super(props);
    const { name, parentPath } = props;
    this.path = createPath(parentPath, name);
  }

  cleanUp(): boolean {
    // do nothing
    return true;
  }

  protected async afterValueChange() {
    // do nothing
  }

  protected assertTraitExistsOnDataStorage(): void {
    // do nothing, always starts from default for in memory
  }
}
