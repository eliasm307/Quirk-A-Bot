import path from 'path';

import { TraitValueTypeUnion } from '../../../declarations/types';
import { iHasCharacterSheet } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import firestoreIdIsValid from '../Firestore/utils/firestoreIdIsValid';
import {
  iBaseTraitDataStorage, iCharacterSheetDataStorage, iDataStorageFactory, iGameDataStorage,
  iTraitCollectionDataStorage, iUserDataStorage,
} from '../interfaces/data-storage-interfaces';
import {
  iCharacterSheetDataStorageFactoryProps,
} from '../interfaces/props/character-sheet-data-storage';
import { iLocalFileDataStorageFactoryProps } from '../interfaces/props/data-storage-factory';
import { iGameDataStorageFactoryProps } from '../interfaces/props/game-data-storage';
import {
  iBaseTraitCollectionDataStorageProps,
} from '../interfaces/props/trait-collection-data-storage';
import { iBaseTraitDataStorageProps } from '../interfaces/props/trait-data-storage';
import { iUserDataStorageFactoryProps } from '../interfaces/props/user-data-storage';
import { createPath } from '../utils/createPath';
import LocalFileCharacterSheetDataStorage from './LocalFileCharacterSheetDataStorage';
import LocalFileTraitCollectionDataStorage from './LocalFileTraitCollectionDataStorage';
import LocalFileTraitDataStorage from './LocalFileTraitDataStorage';

export default class LocalFileDataStorageFactory
  implements iDataStorageFactory
{
  #resolvedBasePath: string;

  constructor({ resolvedBasePath }: iLocalFileDataStorageFactoryProps) {
    this.#resolvedBasePath = resolvedBasePath;
  }

  assertIdIsValid(id: string): void {
    if (!this.idIsValid(id)) throw Error(`Id is not valid: ${id}`);
  }

  createPath(parentPath: string, id: string): string {
    return createPath(parentPath, id);
  }

  idIsValid(id: string): boolean {
    return firestoreIdIsValid(id);
  }

  newCharacterSheetDataStorage(
    props: iCharacterSheetDataStorageFactoryProps
  ): iCharacterSheetDataStorage {
    return new LocalFileCharacterSheetDataStorage({
      ...props,
      dataStorageFactory: this,
      resolvedBasePath: path.resolve(
        __dirname,
        "../data/character-sheets/temporary/"
      ),
    });
  }

  newGameDataStorage(
    props: iGameDataStorageFactoryProps
  ): Promise<iGameDataStorage> {
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

  newUserDataStorage(
    props: iUserDataStorageFactoryProps
  ): Promise<iUserDataStorage> {
    throw new Error("Method not implemented.");
  }
}
