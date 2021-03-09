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
	protected afterAdd(name: N): void {
		// ? do nothing
	}
	/*
	protected addTraitToDataStorage(name: N): void {
		const traitData = this.map.get(name)?.toJson;

		if (!traitData)
			throw Error(
				`Could not add trait with name ${name} to collection at path ${this.path} because there was an error getting the trait data`
			);
		this.#firestore.collection(this.path).add(traitData);
	}
	*/
	protected deleteTraitFromDataStorage(name: N): void {
		this.#firestore
			.collection(this.path)
			.where('name', '==', name)
			.get()
			.then(queryDocs => {
				if (queryDocs.size !== 1)
					throw Error(
						`There should have been exactly 1 trait with name ${name} in collection at path ${this.path}, instead found ${queryDocs.size}`
					);
				queryDocs.forEach(doc => {
					doc.ref.delete().catch(error => {
						console.error(__filename, { error });
						throw Error(`Could not delete trait with name ${name}`);
					});
				});
			});
	}
	#characterSheet: iCharacterSheet; // ? remove if unused
	#firestore: Firestore;
	#unsubscribeFromEventListeners: () => void;

	constructor(props: iFirestoreTraitCollectionDataStorageProps<N, V, D, T>) {
		super(props);
		const { characterSheet, firestore } = props;
		this.#characterSheet = characterSheet;
		this.#firestore = firestore;

		// todo init event listeners
		this.#unsubscribeFromEventListeners = this.attachFirestoreEventListeners()
	}

	protected attachFirestoreEventListeners(): () => void {
		// todo
		throw Error('Method not implemented')
	}
}
