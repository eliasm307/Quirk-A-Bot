
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
	protected afterAdd( name: N ): void {
		throw new Error( 'Method not implemented.' );
	}
	protected afterDelete( name: N ): void {
		throw new Error( 'Method not implemented.' );
	}
	#characterSheet: iCharacterSheet;

	constructor(props: iFirestoreTraitCollectionDataStorageProps<N, V, D, T>) {
		super(props);
		const { characterSheet, firestore } = props;
		this.#characterSheet = characterSheet;

		// todo init event listeners
	}

	
 
}
