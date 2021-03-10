import { Firestore } from './../../../utils/firebase';

import { iCharacterSheet } from '../../../declarations/interfaces/character-sheet-interfaces';
import { iBaseTrait, iBaseTraitData } from '../../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import saveCharacterSheetToFile from '../../../utils/saveCharacterSheetToFile';
import InMemoryTraitCollectionDataStorage from '../InMemory/InMemoryTraitCollectionDataStorage';
import path from 'path';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';
import { iFirestoreTraitCollectionDataStorageProps } from '../../../declarations/interfaces/data-storage-interfaces';
import { isTraitData } from '../../../utils/typePredicates';

export default class FirestoreTraitCollectionDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends AbstractTraitCollectionDataStorage<N, V, D, T> {
	protected afterAdd(name: N): void {
		// ? do nothing
	}
	protected deleteTraitFromDataStorage(name: N): void {
		this.#firestore
			.collection(this.path)
			.where('name', '==', name)
			.get()
			.then(queryDocs => {
				if (queryDocs.size !== 1) {
					throw Error(
						`There should have been exactly 1 trait with name ${name} in collection at path ${this.path}, instead found ${queryDocs.size}`
					);
				}
				queryDocs.forEach(doc => {
					doc.ref.delete().catch(error => {
						console.error(__filename, { error });
						throw Error(`Could not delete trait with name ${name}`);
					});
				});
			})
			.catch(error => {
				return setTimeout((_: any) => {
					throw Error(error);
				});
			});
	}

	#firestore: Firestore;
	#unsubscribeFromEventListeners: () => void = () => {};

	constructor(props: iFirestoreTraitCollectionDataStorageProps<N, V, D, T>) {
		super(props);
		const { firestore } = props;
		this.#firestore = firestore;

		this.initAsync();
	}

	private async initAsync() {
		// ? should collections be asserted? when traits are initialised, these should auto populate collections
		/*
		try {
			await this.assertTraitExistsOnDataStorage({ name: this.name, value: this.private.value });
		} catch (error) {
			console.error(
				__filename,
				`Could not assert that trait with name ${this.name} exists in collection at path ${this.path}`,
				{ error }
			);
		}
		*/

		// add event liseners
		try {
			this.#unsubscribeFromEventListeners = await this.attachFirestoreEventListeners(this.path);
		} catch (error) {
			this.#unsubscribeFromEventListeners();
			console.error(
				__filename,
				`Could not add event listeners to trait collection with name ${this.name} at path ${this.path}`,
				{
					error,
					path: this.path,
				}
			);
		}
	}

	/** Attaches change event listeners for this trait via its parent collection, and returns the unsubscribe function */
	private async attachFirestoreEventListeners(parentCollectionPath: string): Promise<() => void> {
		// todo test event listener

		let unsubscriber = () => {};

		// todo this should be done by a FirestoreCollectionEventListener Class

		try {
			// subscribe to collection level changes
			unsubscriber = this.#firestore.collection(parentCollectionPath).onSnapshot(querySnapshot => {
				querySnapshot.docChanges().forEach(change => {
					const data: any = change.doc.data();

					// confirm it is trait data
					if (!isTraitData(data))
						throw Error(
							`Change on trait collection named ${
								this.name
							}, resulted in data that doesnt satisfy the trait data shape. Data: ${JSON.stringify(data)}`
						);

					const { name, value } = data as iBaseTraitData<N, V>;

					// handle collection changes internally
					switch (change.type) {
						case 'added':
							// add to internal collection
							if (!this.map.has(name)) this.map.set(name, this.createTraitInstance(name, value));
							break;
						case 'removed':
							// remove from internal collection
							this.map.delete(name);
							break;
					}
				});
			});
		} catch (error) {
			console.error(__filename, { error });
			try {
				unsubscriber();
			} finally {
				console.error(`Error setting change listener on trait collection named ${this.name}}`, {
					name: this.name,
					path: this.path,
				});
			}
		}
		return unsubscriber;
	}
}
