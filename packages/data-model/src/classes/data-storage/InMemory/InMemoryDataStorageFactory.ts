import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import {
  iBaseTraitDataStorage, iCharacterSheetDataStorage, iDataStorageFactory, iGameDataStorage,
  iTraitCollectionDataStorage,
} from '../interfaces/data-storage-interfaces';
import {
  iBaseCharacterSheetDataStorageFactoryMethodProps, iGameDataStorageFactoryProps,
} from '../interfaces/props/data-storage-creator';
import { iInMemoryFileDataStorageFactoryProps } from '../interfaces/props/data-storage-factory';
import {
  iBaseTraitCollectionDataStorageProps,
} from '../interfaces/props/trait-collection-data-storage';
import { iBaseTraitDataStorageProps } from '../interfaces/props/trait-data-storage';
import { createPath } from '../utils/createPath';
import InMemoryCharacterSheetDataStorage from './InMemoryCharacterSheetDataStorage';
import InMemoryTraitCollectionDataStorage from './InMemoryTraitCollectionDataStorage';
import InMemoryTraitDataStorage from './InMemoryTraitDataStorage';

export default class InMemoryDataStorageFactory implements iDataStorageFactory {
  assertIdIsValid(id: string): void {
    throw new Error("Method not implemented.");
  }

  createPath(parentPath: string, id: string): string {
    return createPath(parentPath, id);
  }

  idIsValid(id: string): boolean {
    throw new Error("Method not implemented.");
  }

  newCharacterSheetDataStorage(
    props: iBaseCharacterSheetDataStorageFactoryMethodProps
  ): iCharacterSheetDataStorage {
    return new InMemoryCharacterSheetDataStorage({
      ...props,
      dataStorageFactory: this,
    });
  }

  newGameDataStorage(props: iGameDataStorageFactoryProps): iGameDataStorage {
    throw new Error("Method not implemented.");
  }

  newTraitCollectionDataStorageInitialiser(): <
    N extends string,
    V extends TraitValueTypeUnion,
    D extends iBaseTraitData<N, V>,
    T extends iBaseTrait<N, V, D>
  >(
    props: iBaseTraitCollectionDataStorageProps<N, V, D, T>
  ) => iTraitCollectionDataStorage<N, V, D, T> {
    return (props) => new InMemoryTraitCollectionDataStorage({ ...props });
  }

  newTraitDataStorageInitialiser(): <
    N extends TraitNameUnionOrString,
    V extends TraitValueTypeUnion
  >(
    props: iBaseTraitDataStorageProps<N, V>
  ) => iBaseTraitDataStorage<N, V> {
    return (props) => new InMemoryTraitDataStorage({ ...props });
  }
}
