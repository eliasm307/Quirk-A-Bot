import { Firestore } from '@quirk-a-bot/firebase-utils';

import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../../declarations/types';
import isTraitData from '../../../utils/type-predicates/isTraitData';
import { iBaseTrait, iBaseTraitData } from '../../traits/interfaces/trait-interfaces';
import AbstractTraitCollectionDataStorage from '../AbstractTraitCollectionDataStorage';
import {
  iFirestoreTraitCollectionDataStorageProps
} from '../interfaces/props/trait-collection-data-storage';

export default class FirestoreTraitCollectionDataStorage<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iBaseTraitData<N, V>,
	T extends iBaseTrait<N, V, D>
> extends AbstractTraitCollectionDataStorage<N, V, D, T> {
	#firestore: Firestore;
	#unsubscribeFromEventListeners: () => void = () => {};

	constructor(props: iFirestoreTraitCollectionDataStorageProps<N, V, D, T>) {
		super(props);
		const { firestore } = props;
		this.#firestore = firestore;

		this.init();
	}

	protected afterAddInternal(name: N): void {
		// do nothing, traits add themselves to firestore
	}

	protected afterTraitCleanUp(): boolean {
		try {
			this.#unsubscribeFromEventListeners();
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	protected deleteTraitFromDataStorage(name: N): void {
		this.#firestore
			.collection(this.path)
			.where('name', '==', name)
			.get()
			.then(queryDocs => {
				if (queryDocs.size === 0) {
					throw Error(
						`There should have been exactly 1 trait with name ${name} in collection at path ${this.path}, instead found none`
					);
				}
				queryDocs.forEach(doc => {
					doc.ref.delete().catch(error => {
						console.error(__filename, `Could not delete trait with name ${name}`, { error });
					});
				});
			})
			.catch(error => {
				return setTimeout(() => {
					throw Error(error);
				});
			});
	}

	// todo extract this as a util
	/** Attaches change event listeners for this trait via its parent collection, and returns the unsubscribe function */
	private attachFirestoreEventListeners(parentCollectionPath: string): () => void {
		// todo test event listener

		let unsubscriber = () => {};

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

					// ? log these changes? since this is async, you need to manually make sure logs are in right order?
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

	private init() {
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
			this.#unsubscribeFromEventListeners = this.attachFirestoreEventListeners(this.path);
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
}
