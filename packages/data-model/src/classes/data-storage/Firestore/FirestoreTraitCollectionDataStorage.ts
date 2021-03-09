import { Firestore } from './../../../utils/firebase';

import { iCharacterSheet } from '../../../declarations/interfaces/character-sheet-interfaces';
import { iBaseTrait, iBaseTraitData } from '../../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import saveCharacterSheetToFile from '../../../utils/saveCharacterSheetToFile';
import InMemoryTraitCollectionDataStorage from '../InMemory/InMemoryTraitCollectionDataStorage';
import path from 'path';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';
import { iFirestoreTraitCollectionDataStorageProps } from '../../../declarations/interfaces/data-storage-interfaces';

export default class FirestoreTraitCollectionDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends AbstractTraitCollectionDataStorage<N, V, D, T> {
	protected addTraitToDataStorage(name: N): void {
		const traitData = this.map.get(name)?.toJson;

		if (!traitData)
			throw Error(
				`Could not add trait with name ${name} to collection at path ${this.path} because there was an error getting the trait data`
			);
		this.#firestore.collection(this.path).add(traitData);
	}
	protected deleteTraitFromDataStorage(name: N): void {
		throw new Error('Method not implemented.');
	}
	#characterSheet: iCharacterSheet; // ? remove if unused
	#firestore: Firestore;

	constructor(props: iFirestoreTraitCollectionDataStorageProps<N, V, D, T>) {
		super(props);
		const { characterSheet, firestore } = props;
		this.#characterSheet = characterSheet;
		this.#firestore = firestore;

		// todo init event listeners
	}
}
