import { Firestore } from './../../../utils/firebase';
import path from 'path';
import { iCharacterSheet } from '../../../declarations/interfaces/character-sheet-interfaces';
import {
	iFirestoreTraitDataStorageProps,
	iTraitDataStorage,
} from '../../../declarations/interfaces/data-storage-interfaces';
import { TraitValueTypeUnion, TraitNameUnionOrString } from '../../../declarations/types';
import saveCharacterSheetToFile from '../../../utils/saveCharacterSheetToFile';
import InMemoryTraitDataStorage from '../InMemory/InMemoryTraitDataStorage';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';

interface iPrivateModifiableProperties<V extends TraitValueTypeUnion> {
	value: V;
}

export default class FirestoreTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends AbstractTraitDataStorage<N, V>
	implements iTraitDataStorage<N, V> {
	#characterSheet: iCharacterSheet;
	#firestore: Firestore;
	#private: iPrivateModifiableProperties<V>;

	name: N;

	constructor(props: iFirestoreTraitDataStorageProps<N, V>) {
		super();
		const { characterSheet, name, defaultValueIfNotDefined, firestore } = props;
		this.#characterSheet = characterSheet;
		if (!this.#characterSheet) throw Error(`${__filename} characterSheet is not defined`);

		this.#firestore = firestore;
		this.#private = { value: defaultValueIfNotDefined };
		this.name = name;
	}

	get value(): V {}

	set value(newValue: V) {
		// get current value as old value
		const oldValue = this.#private.value;

		// do nothing if values are the same
		if (newValue === oldValue) return;

		// update internal value
		this.#private.value = newValue;

		this.save();
	}

	protected save(): boolean {
		const resolvedPath = path.resolve(this.#resolvedBasePath, `${this.#characterSheet.id}.json`);

		// console.warn(__filename, "Save",  {resolvedPath })

		// save if available
		return saveCharacterSheetToFile(this.#characterSheet.toJson(), resolvedPath);
	}
}
