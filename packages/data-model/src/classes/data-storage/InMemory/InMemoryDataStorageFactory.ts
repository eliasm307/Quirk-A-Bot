import {
	iCharacterSheetDataStorage,
	iHasId,
	iInMemoryFileDataStorageFactoryProps,
} from './../../../declarations/interfaces/data-storage-interfaces';
import { TraitNameUnionOrString } from '../../../declarations/types';
import { iCharacterSheet, iCharacterSheetData } from '../../../declarations/interfaces/character-sheet-interfaces';
import { TraitValueTypeUnion } from '../../../declarations/types';
import {
	iBaseTraitCollectionDataStorageProps,
	iBaseTraitDataStorageProps,
	iDataStorageFactory,
	iTraitCollectionDataStorage,
	iTraitDataStorage,
} from '../../../declarations/interfaces/data-storage-interfaces';
import InMemoryTraitDataStorage from './InMemoryTraitDataStorage';
import { iBaseTraitData, iBaseTrait } from '../../../declarations/interfaces/trait-interfaces';
import InMemoryTraitCollectionDataStorage from './InMemoryTraitCollectionDataStorage';
import InMemoryCharacterSheetDataStorage from './InMemoryCharacterSheetDataStorage';

export default class InMemoryDataStorageFactory implements iDataStorageFactory {
	constructor({}: iInMemoryFileDataStorageFactoryProps) { 
	}
	newCharacterSheetDataStorage({ id }: iHasId): iCharacterSheetDataStorage {
		return new InMemoryCharacterSheetDataStorage({ id, dataStorageFactory: this });
	}
/*
	newTraitCollectionDataStorage<
		N extends string,
		V extends TraitValueTypeUnion,
		D extends iBaseTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(props: iBaseTraitCollectionDataStorageProps<N, V, D, T>): iTraitCollectionDataStorage<N, V, D, T> {
		return new InMemoryTraitCollectionDataStorage({ ...props });
	}*/
	newTraitDataStorageInitialiser(): <N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V> {
		return props => new InMemoryTraitDataStorage({ ...props });
	}

	newTraitCollectionDataStorageInitialiser(): <
		N extends string,
		V extends TraitValueTypeUnion,
		D extends iBaseTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(
		props: iBaseTraitCollectionDataStorageProps<N, V, D, T>
	) => iTraitCollectionDataStorage<N, V, D, T> {
		return props => new InMemoryTraitCollectionDataStorage({ ...props });
	}
}
