import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';
import {
  iBaseTraitDataStorage, iTraitCollectionDataStorage,
} from '../interfaces/data-storage-interfaces';
import {
  iBaseTraitCollectionDataStorageProps,
} from '../interfaces/props/trait-collection-data-storage';
import { iBaseTraitDataStorageProps } from '../interfaces/props/trait-data-storage';
import { createPath } from '../utils/createPath';
import InMemoryTraitDataStorage from './InMemoryTraitDataStorage';

export default class InMemoryTraitCollectionDataStorage<
    N extends TraitNameUnionOrString,
    V extends TraitValueTypeUnion,
    D extends iBaseTraitData<N, V>,
    T extends iBaseTrait<N, V, D>
  >
  extends AbstractTraitCollectionDataStorage<N, V, D, T>
  implements iTraitCollectionDataStorage<N, V, D, T> {
  path: string;

  constructor(props: iBaseTraitCollectionDataStorageProps<N, V, D, T>) {
    super(props);

    const { initialData, parentPath, name } = props;

    this.path = createPath(parentPath, name);

    this.setInitialData(initialData);
  }

  // todo these methods should be optional arguments for the base class, use strategy pattern
  protected addTraitToDataStorage(name: N): void {
    // do nothing
  }

  protected afterTraitCleanUp(): boolean {
    // do nothing
    return true;
  }

  protected async deleteTraitFromDataStorage(name: N) {
    // do nothing
  }

  protected newTraitDataStorage: (
    props: iBaseTraitDataStorageProps<N, V>
  ) => iBaseTraitDataStorage<N, V> = (props) =>
    new InMemoryTraitDataStorage(props);
}
