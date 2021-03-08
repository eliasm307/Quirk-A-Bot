import {
	iCharacterSheetDataStorage,
	iLocalFileDataStorageFactoryProps,
	iHasCharacterSheet,
	iHasId,
} from './../../../declarations/interfaces/data-storage-interfaces';
import { TraitValueTypeUnion } from '../../../declarations/types';
import {
	iBaseTraitCollectionDataStorageProps,
	iBaseTraitDataStorageProps,
	iDataStorageFactory,
	iTraitCollectionDataStorage,
	iTraitDataStorage,
} from '../../../declarations/interfaces/data-storage-interfaces';
import LocalFileTraitDataStorage from './LocalFileTraitDataStorage';
import { iTraitData, iBaseTrait } from '../../../declarations/interfaces/trait-interfaces';
import LocalFileTraitCollectionDataStorage from './LocalFileTraitCollectionDataStorage';
import LocalFileCharacterSheetDataStorage from './LocalFileCharacterSheetDataStorage';
export default class LocalFileDataStorageFactory implements iDataStorageFactory {
	// todo delete comments
	// characterSheet: iCharacterSheet;
	// protected readonly characterSheet: iCharacterSheet;

	/*
	protected characterSheetExists(id: string): boolean {
		return fs.pathExistsSync(this.resolvedFilePath); // check file path exists
	}
	protected getCharacterSheetData(id: string): iCharacterSheetData {
		// todo add option to create blank instance at the specified path if it doesnt exist?
		const data = importDataFromFile(this.resolvedFilePath);

		if (!data) throw Error(`Error importing charactersheet data from ${this.resolvedFilePath}`);

		console.log(`Data imported from ${this.resolvedFilePath}`, { data });

		if (!isCharacterSheetData(data))
			throw Error(`Data loaded from path "${this.resolvedFilePath}" is not valid character sheet data`);

		return data;
	}*/

	#resolvedBasePath: string;

	constructor({ resolvedBasePath }: iLocalFileDataStorageFactoryProps) {
		this.#resolvedBasePath = resolvedBasePath;
		// this.characterSheet = characterSheet
		/*
		// get path relative to character sheet data folder
		this.resolvedFilePath = path.resolve(__dirname, '../../../data/character-sheets/', id);
		// if (!this.characterSheet) throw Error(`Character sheet should not have been null`);

		let data: iCharacterSheetData | null = null;

		// if an instance already exists then use it
		if (CharacterSheet.instances.has(id)) {
			const characterSheet = CharacterSheet.instances.get(id);
			if (characterSheet) {
				data = characterSheet.toJson();
				console.warn(__filename, `Using existing instance for character sheet with id: ${id}`);
				// return;
			} else {
				throw Error(`${__filename} character sheet shold not have been ${characterSheet}`);
			}
		}

		// if character sheet exists then use existing data, else use new data
		const sheet = data
			? data
			: this.characterSheetExists(id)
			? this.getCharacterSheetData(id)
			: CharacterSheet.newData({ id });

		// todo, instead of giving the whole datastorage object, give the methods one by one, then make datastorage methods private, so only a datastorage factory can instantiate a character sheet properly
		// create character sheet instance
		this.characterSheet = new CharacterSheet({ characterSheetData: sheet, dataStorageFactoryInitialiser: this });
		if (!this.characterSheet) throw Error(`Character sheet should not have been null`);

		CharacterSheet.instances.set(id, this.characterSheet);

		console.warn(`Local file data storage initialised successfully for id ${id}`);*/
	}
	newCharacterSheetDataStorage({ id }: iHasId): iCharacterSheetDataStorage {
		return new LocalFileCharacterSheetDataStorage({
			id,
			dataStorageFactory: this,
			resolvedBasePath: this.#resolvedBasePath,
		});
	}
	/*
	newTraitCollectionDataStorage<
		N extends string,
		V extends TraitValueTypeUnion,
		D extends iTraitData<N, V>,
		T extends iBaseTrait<N, V, D>
	>(props: iBaseTraitCollectionDataStorageProps<N, V, D, T>): iTraitCollectionDataStorage<N, V, D, T> {
		return new LocalFileTraitCollectionDataStorage({ ...props });
	}*/

	newTraitDataStorageInitialiser({
		characterSheet,
	}: iHasCharacterSheet): <N extends string, V extends TraitValueTypeUnion>(
		props: iBaseTraitDataStorageProps<N, V>
	) => iTraitDataStorage<N, V> {
		return props =>
			new LocalFileTraitDataStorage({ ...props, characterSheet, resolvedBasePath: this.#resolvedBasePath });
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
		return props => new LocalFileTraitCollectionDataStorage({ ...props, characterSheet });
	}
}
