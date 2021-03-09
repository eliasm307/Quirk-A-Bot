import { Firestore } from './../../../utils/firebase';
import { iCharacterSheet } from '../../../declarations/interfaces/character-sheet-interfaces';
import {
	iFirestoreTraitDataStorageProps,
	iTraitDataStorage,
} from '../../../declarations/interfaces/data-storage-interfaces';
import { TraitValueTypeUnion, TraitNameUnionOrString } from '../../../declarations/types';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';
import pathModule from 'path';
import { isTraitData } from '../../../utils/typePredicates';

export default class FirestoreTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends AbstractTraitDataStorage<N, V>
	implements iTraitDataStorage<N, V> {
	#characterSheet: iCharacterSheet;
	#firestore: Firestore;
	#path: string;
	#unsubscribeToCollection: () => void; // todo add cleanup method which calls this

	constructor(props: iFirestoreTraitDataStorageProps<N, V>) {
		super(props);
		const { characterSheet, firestore, path } = props;
		this.#characterSheet = characterSheet; // ? remove?
		this.#firestore = firestore;
		this.#path = path;

		// add event liseners
		const parentPath = pathModule.dirname(this.#path);
		this.#unsubscribeToCollection = this.attachFirestoreEventListeners(parentPath);
	}

	/** Attaches change event listeners for this trait via its parent collection, and returns the unsubscribe function */
	protected attachFirestoreEventListeners(parentCollectionPath: string): () => void {
		// todo test event listener

		try {
			// subscribe to collection level changes
			return this.#firestore
				.collection(parentCollectionPath)
				.where('name', '==', this.name)
				.onSnapshot(querySnapshot => {
					// confirm query only returns 1 result
					if (querySnapshot.size !== 1)
						throw Error(
							`There should be exactly 1 trait named ${this.name} in collection ${parentCollectionPath}, however ${querySnapshot.size} where found`
						);

					querySnapshot.docChanges().forEach(change => {
						const data: any = change.doc.data();

						if (!isTraitData(data))
							throw Error(
								`Change on trait named ${
									this.name
								} in collection ${parentCollectionPath}, resulted in data that doesnt satisfy the trait data shape. Data: ${JSON.stringify(
									data
								)}`
							);

						console.warn('item change', change);
						if (change.type === 'modified') {
							console.warn('Modified document: ', { data });
							// apply private modification
							this.private.value = data.value as V;
						}
					});
				});
		} catch (error) {
			console.error(__filename, { error });
			try {
				this.#unsubscribeToCollection();
			} finally {
				throw Error(`Error setting change listener on trait named ${this.name} in collection ${parentCollectionPath}}`);
			}
		}
	}

	/** Function to be called after the local value is changed, to signal that the data storage value should also be changed */
	protected afterValueChange(oldValue: V, newValue: V): void {
		this.#firestore
			.doc(this.#path)
			.get()
			.then(doc => {
				// check document exists
				if (!doc.exists) {
					try {
						// if it doesnt exist, it might be a left over from an old delete, delete it again just incase
						console.log(__filename, `Attempting to delet trait document ${this.#path}, it is shown as not existing`);
						doc.ref.delete();
					} catch (error) {
						console.error(__filename, { error });
					} finally {
						throw Error(`Trait document does not exist at path ${this.#path}`);
					}
				}
				return doc.ref;
			})
			.then(doc => doc.update({ value: this.value }))
			.catch(error => {
				console.error(__filename, { error });
				throw Error(`Error updating trait ${this.name} (${this.#path}) from ${oldValue} to ${newValue}`);
			});
	}
}
