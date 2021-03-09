import {
	iCharacterSheetDataStorage,
	iFirestoreDataStorageFactoryProps,
	iHasCharacterSheet,
	iHasId,
	iTraitDataStorageInitialiserProps,
} from '../../../declarations/interfaces/data-storage-interfaces';
import { TraitValueTypeUnion } from '../../../declarations/types';
import {
	iBaseTraitCollectionDataStorageProps,
	iBaseTraitDataStorageProps,
	iDataStorageFactory,
	iTraitCollectionDataStorage,
	iTraitDataStorage,
} from '../../../declarations/interfaces/data-storage-interfaces';
import { iBaseTraitData, iBaseTrait } from '../../../declarations/interfaces/trait-interfaces';
import { Firestore } from '../../../utils/firebase';
import FirestoreTraitDataStorage from './FirestoreTraitDataStorage';
import FirestoreTraitCollectionDataStorage from './FirestoreTraitCollectionDataStorage';
import FirestoreCharacterSheetDataStorage from './FirestoreCharacterSheetDataStorage';
export default class FirestoreDataStorageFactory implements iDataStorageFactory {
	#firestore: Firestore;

	constructor({ firestore }: iFirestoreDataStorageFactoryProps) {
		this.#firestore = firestore;
	}
	newCharacterSheetDataStorage({ id }: iHasId): iCharacterSheetDataStorage {
		return new FirestoreCharacterSheetDataStorage({
			id,
			dataStorageFactory: this,
			firestore: this.#firestore,
		});
	}

	newTraitDataStorageInitialiser({
		characterSheet,
	}: iTraitDataStorageInitialiserProps): <N extends string, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V> {
		return props => new FirestoreTraitDataStorage({ ...props, characterSheet, firestore: this.#firestore });
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
