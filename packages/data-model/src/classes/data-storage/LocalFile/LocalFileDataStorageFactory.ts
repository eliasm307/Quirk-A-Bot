import { TraitValueTypeUnion } from '../../../declarations/types';
import { iHasCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import {
  iBaseTraitDataStorage, iCharacterSheetDataStorage, iDataStorageFactory, iGameDataStorage,
  iTraitCollectionDataStorage,
} from '../interfaces/data-storage-interfaces';
import {
  iBaseCharacterSheetDataStorageFactoryMethodProps, iGameDataStorageFactoryProps,
} from '../interfaces/props/data-storage-creator';
import { iLocalFileDataStorageFactoryProps } from '../interfaces/props/data-storage-factory';
import {
  iBaseTraitCollectionDataStorageProps,
} from '../interfaces/props/trait-collection-data-storage';
import { iBaseTraitDataStorageProps } from '../interfaces/props/trait-data-storage';
import LocalFileCharacterSheetDataStorage from './LocalFileCharacterSheetDataStorage';
import LocalFileTraitCollectionDataStorage from './LocalFileTraitCollectionDataStorage';
import LocalFileTraitDataStorage from './LocalFileTraitDataStorage';

export default class LocalFileDataStorageFactory
  implements iDataStorageFactory {
  #resolvedBasePath: string;

  constructor({ resolvedBasePath }: iLocalFileDataStorageFactoryProps) {
    this.#resolvedBasePath = resolvedBasePath;
  }

  idIsValid(id: string): boolean {
    throw new Error("Method not implemented.");
  }

  newCharacterSheetDataStorage(
    props: iBaseCharacterSheetDataStorageFactoryMethodProps
  ): iCharacterSheetDataStorage {
    return new LocalFileCharacterSheetDataStorage({
      ...props,
      dataStorageFactory: this,
      resolvedBasePath: this.#resolvedBasePath,
    });
  }

  newGameDataStorage(props: iGameDataStorageFactoryProps): iGameDataStorage {
    throw new Error("Method not implemented.");
  }

  newTraitCollectionDataStorageInitialiser({
    characterSheet,
  }: iHasCharacterSheet): <
    N extends string,
    V extends TraitValueTypeUnion,
    D extends iBaseTraitData<N, V>,
    T extends iBaseTrait<N, V, D>
  >(
    props: iBaseTraitCollectionDataStorageProps<N, V, D, T>
  ) => iTraitCollectionDataStorage<N, V, D, T> {
    return (props) =>
      new LocalFileTraitCollectionDataStorage({
        ...props,
        characterSheet,
        resolvedBasePath: this.#resolvedBasePath,
      });
  }

  newTraitDataStorageInitialiser({
    characterSheet,
  }: iHasCharacterSheet): <N extends string, V extends TraitValueTypeUnion>(
    props: iBaseTraitDataStorageProps<N, V>
  ) => iBaseTraitDataStorage<N, V> {
    return (props) =>
      new LocalFileTraitDataStorage({
        ...props,
        characterSheet,
        resolvedBasePath: this.#resolvedBasePath,
      });
  }
}
