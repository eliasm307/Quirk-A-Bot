import { Firestore, TraitValueTypeUnion } from '@quirk-a-bot/common';

import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import {
  iBaseTraitDataStorage, iCharacterSheetDataStorage, iDataStorageFactory, iGameDataStorage,
  iTraitCollectionDataStorage,
} from '../interfaces/data-storage-interfaces';
import {
  iBaseCharacterSheetDataStorageFactoryMethodProps, iGameDataStorageFactoryProps,
} from '../interfaces/props/data-storage-creator';
import { iFirestoreDataStorageFactoryProps } from '../interfaces/props/data-storage-factory';
import {
  iBaseTraitCollectionDataStorageProps,
} from '../interfaces/props/trait-collection-data-storage';
import { iBaseTraitDataStorageProps } from '../interfaces/props/trait-data-storage';
import FirestoreCharacterSheetDataStorage from './FirestoreCharacterSheetDataStorage';
import FirestoreGameDataStorage from './FirestoreGameDataStorage';
import FirestoreTraitCollectionDataStorage from './FirestoreTraitCollectionDataStorage';
import FirestoreTraitDataStorage from './FirestoreTraitDataStorage';
import firestoreIdIsValid from './utils/firestoreIdIsValid';

export default class FirestoreDataStorageFactory
  implements iDataStorageFactory {
  #firestore: Firestore;

  constructor({ firestore }: iFirestoreDataStorageFactoryProps) {
    this.#firestore = firestore;
  }

  idIsValid(id: string): boolean {
    return firestoreIdIsValid(id);
  }

  newCharacterSheetDataStorage(
    props: iBaseCharacterSheetDataStorageFactoryMethodProps
  ): iCharacterSheetDataStorage {
    return new FirestoreCharacterSheetDataStorage({
      ...props,
      dataStorageFactory: this,
      firestore: this.#firestore,
    });
  }

  newGameDataStorage(props: iGameDataStorageFactoryProps): iGameDataStorage {
    // todo implement
    return new FirestoreGameDataStorage({
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
      new FirestoreTraitCollectionDataStorage({
        ...props,
        firestore: this.#firestore,
      });
  }

  newTraitDataStorageInitialiser(): <
    N extends string,
    V extends TraitValueTypeUnion
  >(
    props: iBaseTraitDataStorageProps<N, V>
  ) => iBaseTraitDataStorage<N, V> {
    return (props) =>
      new FirestoreTraitDataStorage({ ...props, firestore: this.#firestore });
  }
}
