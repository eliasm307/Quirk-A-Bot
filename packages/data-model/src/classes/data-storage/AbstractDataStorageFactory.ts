import { iBaseTrait, iTraitData } from '../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../declarations/types';
import CharacterSheet from '../CharacterSheet';
import { iCharacterSheet, iCharacterSheetData } from './../../declarations/interfaces/character-sheet-interfaces';
import {
	iBaseDataStorage,
	iBaseDataStorageFactoryProps,
	iBaseTraitCollectionDataStorageProps,
	iBaseTraitDataStorageProps,
	iDataStorageFactory,
	iTraitCollectionDataStorage,
	iTraitDataStorage,
} from './../../declarations/interfaces/data-storage-interfaces';

// todo delete?
export default abstract class AbstractDataStorageFactory implements iDataStorageFactory {
	readonly characterSheet: iCharacterSheet;

	constructor(props: iBaseDataStorageFactoryProps) {
		const { id } = props;

    // if an instance already exists then use it
		if (CharacterSheet.instances.has(id)) {
			this.characterSheet = CharacterSheet.instances.get(id)!;
			return;
		}

    // if character sheet exists then use existing data, else use new data
		const sheet = this.characterSheetExists(id) ? this.getCharacterSheetData(id) : CharacterSheet.newData({ id });

    // todo, instead of giving the whole datastorage object, give the methods one by one, then make datastorage methods private, so only a datastorage factory can instantiate a character sheet properly
    // create character sheet instance
		this.characterSheet = new CharacterSheet({ characterSheetData: sheet, dataStorageFactory: this });
	}

	protected abstract characterSheetExists(id: string): boolean;
	protected abstract getCharacterSheetData(id: string): iCharacterSheetData;

	abstract newTraitDataStorageInitialiser<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>(): (
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V>;

	abstract newTraitCollectionDataStorageInitialiser<
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(): (props: iBaseTraitCollectionDataStorageProps<N, V, D, T>) => iTraitCollectionDataStorage<N, V, D, T>;

	abstract newTraitCollectionDataStorage<
		N extends TraitNameUnionOrString,
		V extends TraitValueTypeUnion,
		D extends iTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(props: iBaseTraitCollectionDataStorageProps<N, V, D, T>): iTraitCollectionDataStorage<N, V, D, T>;
}
