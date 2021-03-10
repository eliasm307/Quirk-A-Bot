import { Firestore } from './../../../utils/firebase';
import {
	iFirestoreTraitDataStorageProps,
	iBaseTraitDataStorage,
} from '../../../declarations/interfaces/data-storage-interfaces';
import { TraitValueTypeUnion, TraitNameUnionOrString } from '../../../declarations/types';
import AbstractTraitDataStorage from '../AbstractTraitDataStorage';
import pathModule from 'path';
import { isTraitData } from '../../../utils/typePredicates';
import { iBaseTraitData } from '../../../declarations/interfaces/trait-interfaces';
import { iHasCleanUp } from '../../../declarations/interfaces/general-interfaces';

export default class FirestoreTraitDataStorage<N extends TraitNameUnionOrString, V extends TraitValueTypeUnion>
	extends AbstractTraitDataStorage<N, V>
	implements iBaseTraitDataStorage<N, V>, iHasCleanUp {
	protected async assertTraitExistsOnDataStorage(traitData: iBaseTraitData<N, V>): Promise<void> {
		// try getting the document#
		// ? does this need error handling?
		const doc = await this.#firestore.doc(this.path).get();

		if (!doc || !doc.exists) {
			// if the document doesnt exist then try adding it
			// console.log(__filename, `Trait does not exist at path ${this.path}, adding this now`);
			try {
				await this.#firestore.doc(this.path).set(traitData);
				// console.log(__filename, `Trait added at path ${this.path}`, { path: this.path, traitData });
			} catch (error) {
				console.error(__filename, { error });
				throw Error(`Trait with name ${this.name} did not exist and could not be added to data store`);
			}
		}
	}
	#firestore: Firestore;
	path: string;
	#unsubscribeFromEventListeners: () => void = () => null; // todo add cleanup method which calls this

	constructor(props: iFirestoreTraitDataStorageProps<N, V>) {
		super(props);
		const { firestore, path, defaultValueIfNotDefined } = props;
		this.#firestore = firestore;
		this.path = path;

		const timerName = `Time to initialise trait "${this.path}"`;

		console.time(timerName);
		// make sure trait exists, then set listeners on it
		this.initAsync()
			.then(() => {
				// console.warn(`Successfully initialised trait with path ${this.path} and value ${this.private.value}`);
			})
			.catch(console.error)
			.finally( () => console.timeEnd( timerName ) );
		// todo tidy up
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

	private async initAsync() {
		try {
			await this.assertTraitExistsOnDataStorage({ name: this.name, value: this.private.value });
		} catch (error) {
			console.error(
				__filename,
				`Could not assert that trait with name ${this.name} exists in collection at path ${this.path}`,
				{ error }
			);
		}
		const parentPath = pathModule.dirname(this.path);

		try {
			// add event liseners
			this.#unsubscribeFromEventListeners = await this.attachFirestoreEventListeners(parentPath);
		} catch (error) {
			this.#unsubscribeFromEventListeners();
			console.error(__filename, `Could not add event listeners to trait with name ${this.name} at path ${this.path}`, {
				error,
				parentPath,
				path: this.path,
			});
		}
	}

	/** Attaches change event listeners for this trait via its parent collection, and returns the unsubscribe function */
	private async attachFirestoreEventListeners(parentCollectionPath: string): Promise<() => void> {
		// todo test event listener

		// todo this should be done by a FirestoreDocumentEventListener Class

		let unsubscriber = () => {};

		try {
			// subscribe to collection level changes
			unsubscriber = this.#firestore
				.collection(parentCollectionPath)
				.where('name', '==', this.name)
				.onSnapshot(querySnapshot => {
					// confirm query only returns 1 result
					/*if (querySnapshot.size !== 1) {
						console.error(
							__filename,
							`There should be exactly 1 trait named "${this.name}" in collection "${parentCollectionPath}", however ${querySnapshot.size} where found`,
							{ traitName: this.name, traitPath: this.path, parentCollectionPath }
						);*/
						/*throw Error(
							`There should be exactly 1 trait named "${this.name}" in collection "${parentCollectionPath}", however ${querySnapshot.size} where found`
						);*/
				//	}

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

						// logFirestoreChange(change, console.warn);
						if (change.type === 'modified') {
							// console.warn('Modified document: ', { data });
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
		try {
			const doc = await this.#firestore.doc(this.path).get();

			// ? is this right? does doc.exists actually mean the document doesn exist?
			// check document exists
			if (!doc.exists) {
				// if it doesnt exist, it might be a left over from an old delete, delete it again just incase
				// console.log(__filename, `Attempting to delete trait document ${this.#path}, it is shown as not existing`);
				// await doc.ref.delete();

				return console.error(`Trait document does not exist at path ${this.path}`, {
					traitPath: this.path,
					docData: doc.data(),
					docId: doc.id,
					docExists: doc.exists,
					docHasPendingWrites: doc.metadata.hasPendingWrites,
				});
			}

			// try updating value
			try {
				return await doc.ref.update({ value: this.value });
			} catch (error) {
				console.error(__filename, `Error updating trait ${this.name} (${this.path}) from ${oldValue} to ${newValue}`, {
					error,
				});
			}
		} catch (error) {
			console.error(__filename, { error });
		}
	}
	cleanUp(): boolean {
		try {
			this.#unsubscribeFromEventListeners();
			return true;
		} catch (error) {
			console.error(__filename, `Error cleaning up listeners for trait with path ${this.path}`);
			return false;
		}
	}
}
