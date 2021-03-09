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
import { iBaseTraitData } from '../../../declarations/interfaces/trait-interfaces';
import logFirestoreChange from '../../../utils/logFirestoreChange';

export default class FirestoreTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends AbstractTraitDataStorage<N, V>
	implements iTraitDataStorage<N, V> {
	protected async assertTraitExistsOnDataStorage(traitData: iBaseTraitData<N, V>): Promise<void> {
		// try getting the document#
		// ? does this need error handling?
		const doc = await this.#firestore.doc(this.#path).get();

		if (!doc || !doc.exists) {
			// if the document doesnt exist then try adding it
			console.log(__filename, `Trait does not exist at path ${this.#path}, adding this now`);
			try {
				this.#firestore.doc(this.#path).set(traitData);
			} catch (error) {
				console.error(__filename, { error });
				throw Error(`Trait with name ${this.name} did not exist and could not be added to data store`);
			}
		}
	}
	#firestore: Firestore;
	#path: string;
	#unsubscribeFromEventListeners: () => void = () => null; // todo add cleanup method which calls this

	constructor(props: iFirestoreTraitDataStorageProps<N, V>) {
		super(props);
		const { firestore, path, defaultValueIfNotDefined } = props;
		this.#firestore = firestore;
		this.#path = path;

		// make sure trait exists, then set listeners on it
		this.init();
		/*this.assertTraitExistsOnDataStorage({ name: this.name, value: defaultValueIfNotDefined })
			.then(_ => {
				// add event liseners
				const parentPath = pathModule.dirname(this.#path);
				return this.attachFirestoreEventListeners(parentPath);
			})
			.then(unsubFunc => (this.#unsubscribeFromEventListeners = unsubFunc))
			.catch(error => {
				return setTimeout(_ => {
					throw Error();
				});
			});*/
	}

	private async init() {
		try {
			await this.assertTraitExistsOnDataStorage({ name: this.name, value: this.private.value });

			// add event liseners
			const parentPath = pathModule.dirname(this.#path);
			this.#unsubscribeFromEventListeners = await this.attachFirestoreEventListeners(parentPath);
		} catch (error) {
			console.error(
				__filename,
				`Could not assert that trait with name ${this.name} exists in collection at path ${this.#path}`,
				{ error }
			);
		}
	}

	/** Attaches change event listeners for this trait via its parent collection, and returns the unsubscribe function */
	private async attachFirestoreEventListeners(parentCollectionPath: string): Promise<() => void> {
		// todo test event listener

		let unsubscriber = () => {};

		try {
			// subscribe to collection level changes
			unsubscriber = await this.#firestore
				.collection(parentCollectionPath)
				.where('name', '==', this.name)
				.onSnapshot(querySnapshot => {
					// confirm query only returns 1 result
					if (querySnapshot.size !== 1) {
						console.error(__filename, { traitName: this.name, traitPath: this.#path });
						throw Error(
							`There should be exactly 1 trait named "${this.name}" in collection "${parentCollectionPath}", however ${querySnapshot.size} where found`
						);
					}

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

						logFirestoreChange(change, console.warn);
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
				unsubscriber();
			} finally {
				console.error(
					`Error setting change listener on trait named ${this.name} in collection ${parentCollectionPath}}`
				);
			}
		}
		return unsubscriber;
	}

	/** Function to be called after the local value is changed, to signal that the data storage value should also be changed */
	protected afterValueChange(oldValue: V, newValue: V): void {
		this.handleChangeAsync(oldValue, newValue);
	}

	private async handleChangeAsync(oldValue: V, newValue: V) {
		const doc = await this.#firestore.doc(this.#path).get();

		// check document exists
		if (!doc.exists) {
			try {
				// if it doesnt exist, it might be a left over from an old delete, delete it again just incase
				console.log(__filename, `Attempting to delete trait document ${this.#path}, it is shown as not existing`);
				await doc.ref.delete();
			} catch (error) {
				console.error(__filename, { error });
			}
			return console.error(`Trait document does not exist at path ${this.#path}`);
		}

		// try updating value
		try {
			await doc.ref.update({ value: this.value });
		} catch (error) {
			console.error(__filename, `Error updating trait ${this.name} (${this.#path}) from ${oldValue} to ${newValue}`, {
				error,
			});
		}
	}
	cleanUp(): boolean {
		try {
			this.#unsubscribeFromEventListeners();
			return true;
		} catch (error) {
			console.error(__filename, `Error cleaning up listeners for trait with path ${this.#path}`);
			return false;
		}
	}
}
