import { TraitValueTypeUnion } from '../../../declarations/types';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import {
  iBaseCharacterSheetDataStorageFactoryMethodProps, iBaseTraitCollectionDataStorageProps,
  iBaseTraitDataStorage, iBaseTraitDataStorageProps, iCharacterSheetDataStorage,
  iDataStorageFactory, iFirestoreDataStorageFactoryProps, iTraitCollectionDataStorage
} from '../interfaces/data-storage-interfaces';
import FirestoreCharacterSheetDataStorage from './FirestoreCharacterSheetDataStorage';
import FirestoreTraitCollectionDataStorage from './FirestoreTraitCollectionDataStorage';
import FirestoreTraitDataStorage from './FirestoreTraitDataStorage';
import { Firestore } from './utils/firebase';

export default class FirestoreDataStorageFactory implements iDataStorageFactory {
	#firestore: Firestore;

	constructor({ firestore }: iFirestoreDataStorageFactoryProps) {
		this.#firestore = firestore;
	}

	newCharacterSheetDataStorage(props: iBaseCharacterSheetDataStorageFactoryMethodProps): iCharacterSheetDataStorage {
		return new FirestoreCharacterSheetDataStorage({
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
		return props => new FirestoreTraitCollectionDataStorage({ ...props, firestore: this.#firestore });
	}

	newTraitDataStorageInitialiser(): <N extends string, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iBaseTraitDataStorage<N, V> {
		return props => new FirestoreTraitDataStorage({ ...props, firestore: this.#firestore });
	}
}
