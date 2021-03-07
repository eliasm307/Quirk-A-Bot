import { iBaseTrait, iTraitData } from '../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../declarations/types';
import CharacterSheet from '../CharacterSheet';
import { iCharacterSheet, iCharacterSheetData } from './../../declarations/interfaces/character-sheet-interfaces';
import {
	iBaseDataStorage,
	iBaseDataStorageFactoryProps,
	iBaseTraitCollectionDataStorageProps,
	iBaseTraitDataStorageProps,
	iCharacterSheetDataStorage,
	iDataStorageFactory,
	iHasCharacterSheet,
	iHasId,
	iTraitCollectionDataStorage,
	iTraitDataStorage,
} from './../../declarations/interfaces/data-storage-interfaces';

// todo delete?
export default abstract class AbstractDataStorageFactory implements iDataStorageFactory {
	// abstract readonly characterSheet: iCharacterSheet;

	abstract newCharacterSheetDataStorage(props: iHasId): iCharacterSheetDataStorage;

	// 	protected abstract characterSheetExists(id: string): boolean;
	// 	protected abstract getCharacterSheetData(id: string): iCharacterSheetData;

	abstract newTraitDataStorageInitialiser(): <N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V>;

	abstract newTraitCollectionDataStorageInitialiser(
		props: iHasCharacterSheet
	): <
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(props: iBaseTraitCollectionDataStorageProps<N, V, D, T>) => iTraitCollectionDataStorage<N, V, D, T>;

	abstract newTraitCollectionDataStorage<
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(props: iBaseTraitCollectionDataStorageProps<N, V, D, T>): iTraitCollectionDataStorage<N, V, D, T>;
}
