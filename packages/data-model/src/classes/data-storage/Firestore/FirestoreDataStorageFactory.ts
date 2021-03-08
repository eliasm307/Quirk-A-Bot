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
import { iTraitData, iBaseTrait } from '../../../declarations/interfaces/trait-interfaces';
export default class FirestoreDataStorageFactory implements iDataStorageFactory {
	#resolvedBasePath: string;

	constructor({ resolvedBasePath }: iFirestoreDataStorageFactoryProps) {
		this.#resolvedBasePath = resolvedBasePath;
	}
	newCharacterSheetDataStorage({ id }: iHasId): iCharacterSheetDataStorage {
		return new FirestoreCharacterSheetDataStorage({
			id,
			dataStorageFactory: this,
			resolvedBasePath: this.#resolvedBasePath,
		});
	}

	newTraitDataStorageInitialiser({
		characterSheet,
	}: iTraitDataStorageInitialiserProps): <N extends string, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V> {
		return props =>
			new FirestoreTraitDataStorage({ ...props, characterSheet, resolvedBasePath: this.#resolvedBasePath });
	}

	newTraitCollectionDataStorageInitialiser({
		characterSheet,
	}: iHasCharacterSheet): <
		N extends string,
		V extends TraitValueTypeUnion,
		D extends iTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(
		props: iBaseTraitCollectionDataStorageProps<N, V, D, T>
	) => iTraitCollectionDataStorage<N, V, D, T> {
		return props => new FirestoreTraitCollectionDataStorage({ ...props, characterSheet });
	}
}
