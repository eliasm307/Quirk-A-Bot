import { iBaseTraitData, iBaseTrait } from '../../../declarations/interfaces/trait-interfaces';
import { Firestore } from '../../../utils/firebase';
import FirestoreTraitDataStorage from './FirestoreTraitDataStorage';
import FirestoreTraitCollectionDataStorage from './FirestoreTraitCollectionDataStorage';
import FirestoreCharacterSheetDataStorage from './FirestoreCharacterSheetDataStorage';
import {
	iDataStorageFactory,
	iFirestoreDataStorageFactoryProps,
	iHasId,
	iCharacterSheetDataStorage,
	iTraitDataStorageInitialiserFactoryProps,
	iBaseTraitDataStorageProps,
	iTraitDataStorage,
	iHasCharacterSheet,
	iBaseTraitCollectionDataStorageProps,
	iTraitCollectionDataStorage,
	iBaseCharacterSheetDataStorageFactoryMethodProps,
} from '../../../declarations/interfaces/data-storage-interfaces';
import { TraitValueTypeUnion } from '../../../declarations/types';
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

	newTraitDataStorageInitialiser( ): <N extends string, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V> {
		return props => new FirestoreTraitDataStorage({ ...props, firestore: this.#firestore });
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
		return props => new FirestoreTraitCollectionDataStorage({ ...props, characterSheet, firestore: this.#firestore });
	}
}
