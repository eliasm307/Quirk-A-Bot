import { Firestore, TraitValueTypeUnion } from '@quirk-a-bot/common';

import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import firestoreIdIsValid from '../Firestore/utils/firestoreIdIsValid';
import {
  iBaseTraitDataStorage, iCharacterSheetDataStorage, iDataStorageFactory, iGameDataStorage,
  iTraitCollectionDataStorage,
} from '../interfaces/data-storage-interfaces';
import {
  iBaseCharacterSheetDataStorageFactoryMethodProps, iGameDataStorageFactoryProps,
} from '../interfaces/props/data-storage-creator';
import {
  iFirestoreCompositeDataStorageFactoryProps,
} from '../interfaces/props/data-storage-factory';
import {
  iBaseTraitCollectionDataStorageProps,
} from '../interfaces/props/trait-collection-data-storage';
import { iBaseTraitDataStorageProps } from '../interfaces/props/trait-data-storage';
import FirestoreCompositeCharacterSheetDataStorage from './CharacterSheetDataStorage';
import FirestoreCompositeTraitCollectionDataStorage from './TraitCollectionDataStorage';
import FirestoreCompositeTraitDataStorage from './TraitDataStorage';

export default class FirestoreCompositeDataStorageFactory
  implements iDataStorageFactory {
  #firestore: Firestore;

  constructor({ firestore }: iFirestoreCompositeDataStorageFactoryProps) {
    this.#firestore = firestore;
  }

  idIsValid(id: string): boolean {
    return firestoreIdIsValid(id);
  }

  newCharacterSheetDataStorage(
    props: iBaseCharacterSheetDataStorageFactoryMethodProps
  ): iCharacterSheetDataStorage {
    return new FirestoreCompositeCharacterSheetDataStorage({
      ...props,
      dataStorageFactory: this,
      firestore: this.#firestore,
    });
  }

  newGameDataStorage(props: iGameDataStorageFactoryProps): iGameDataStorage {
    // todo implement
    return new FirestoreCompositeGameDataStorage({
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
