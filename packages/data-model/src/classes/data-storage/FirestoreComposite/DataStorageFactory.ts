import { Firestore, TraitValueTypeUnion } from '@quirk-a-bot/common';

import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import firestoreIdIsValid from '../Firestore/utils/firestoreIdIsValid';
import {
  iCharacterSheetDataStorage, iDataStorageFactory, iGameDataStorage, iTraitCollectionDataStorage,
} from '../interfaces/data-storage-interfaces';
import {
  iCharacterSheetDataStorageFactoryProps,
} from '../interfaces/props/character-sheet-data-storage';
import {
  iFirestoreCompositeDataStorageFactoryProps,
} from '../interfaces/props/data-storage-factory';
import { iGameDataStorageFactoryProps } from '../interfaces/props/game-data-storage';
import {
  iBaseTraitCollectionDataStorageProps,
} from '../interfaces/props/trait-collection-data-storage';
import { createPath } from '../utils/createPath';
import FirestoreCompositeCharacterSheetDataStorage from './CharacterSheetDataStorage';
import FirestoreCompositeGameDataStorage from './GameDataStorage';
import FirestoreCompositeTraitCollectionDataStorage from './TraitCollectionDataStorage';

export default class FirestoreCompositeDataStorageFactory
  implements iDataStorageFactory
{
  #firestore: Firestore;

  constructor({ firestore }: iFirestoreCompositeDataStorageFactoryProps) {
    this.#firestore = firestore;
  }

  assertIdIsValid(id: string): void {}

  createPath(parentPath: string, id: string): string {
    return createPath(parentPath, id);
  }

  idIsValid(id: string): boolean {
    return firestoreIdIsValid(id);
  }

  newCharacterSheetDataStorage(
    props: iCharacterSheetDataStorageFactoryProps
  ): iCharacterSheetDataStorage {
    return new FirestoreCompositeCharacterSheetDataStorage({
      ...props,
      dataStorageFactory: this,
      firestore: this.#firestore,
    });
  }

  async newGameDataStorage(
    props: iGameDataStorageFactoryProps
  ): Promise<iGameDataStorage> {
    // todo implement
    return FirestoreCompositeGameDataStorage.load({
      ...props,
      dataStorageFactory: this,
      firestore: this.#firestore,
    });
  }

  newTraitCollectionDataStorageInitialiser(): <
    N extends string,
    V extends TraitValueTypeUnion,
    D extends iBaseTraitData<N, V>,
    T extends iBaseTrait<N, V, D>
  >(
    props: iBaseTraitCollectionDataStorageProps<N, V, D, T>
  ) => iTraitCollectionDataStorage<N, V, D, T> {
    return (props) =>
      new FirestoreCompositeTraitCollectionDataStorage({
        ...props,
        firestore: this.#firestore,
      });
  }

  /*
  newTraitDataStorageInitialiser(): <
    N extends string,
    V extends TraitValueTypeUnion
  >(
    props: iBaseTraitDataStorageProps<N, V>
  ) => iBaseTraitDataStorage<N, V> {
    return (props) =>
      new FirestoreCompositeTraitDataStorage({
        ...props,
        firestore: this.#firestore,
        subDocument: new Sub(),
      });
  }
  */
}
/**/
