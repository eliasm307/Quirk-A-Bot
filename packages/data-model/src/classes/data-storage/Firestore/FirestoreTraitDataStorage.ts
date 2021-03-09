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

export default class FirestoreTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends AbstractTraitDataStorage<N, V>
	implements iTraitDataStorage<N, V> {
	#characterSheet: iCharacterSheet;
	#firestore: Firestore;

	constructor(props: iFirestoreTraitDataStorageProps<N, V>) {
		super(props);
		const { characterSheet, firestore } = props;
		this.#characterSheet = characterSheet;
		this.#firestore = firestore;
	}

	protected attachFirestoreEventListeners(): void {
		
	}
	protected afterValueChange(): void {}
}
