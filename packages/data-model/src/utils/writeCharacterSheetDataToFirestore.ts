import { CORE_TRAIT_COLLECTION_NAME } from './../constants';
import path from 'path';
import {
	ATTRIBUTE_COLLECTION_NAME,
	DISCIPLINE_COLLECTION_NAME,
	SKILL_COLLECTION_NAME,
	TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME,
} from '../constants';
import { iCharacterSheetData } from '../declarations/interfaces/character-sheet-interfaces';
import { iGeneralTraitData } from '../declarations/interfaces/trait-interfaces';
import { Firestore, FirestoreBatch } from './firebase';

// todo test

export default async function writeCharacterSheetDataToFirestore(
	firestore: Firestore,
	path: string,
	data: iCharacterSheetData
) {
	const {
		// core data
		id,
		clan,
		health,
		humanity,
		hunger,
		name,
		sire,
		willpower,
		bloodPotency,

		// trait collection data
		attributes,
		disciplines,
		skills,
		touchstonesAndConvictions,
	} = data;

	const coreData = {
		id,
	};

	const coreTraits: iGeneralTraitData[] = [clan, health, humanity, hunger, name, sire, willpower, bloodPotency];

	try {
		const csDoc = firestore.doc(path);

		// create new firestore batch
		const batch = firestore.batch();

		// write core data
		batch.set(csDoc, coreData);

		// write trait collection data as firestore collections
		writeTraitCollectionAsBatch(firestore, coreTraits, CORE_TRAIT_COLLECTION_NAME, batch);
		writeTraitCollectionAsBatch(firestore, attributes, ATTRIBUTE_COLLECTION_NAME, batch);
		writeTraitCollectionAsBatch(firestore, disciplines, DISCIPLINE_COLLECTION_NAME, batch);
		writeTraitCollectionAsBatch(firestore, skills, SKILL_COLLECTION_NAME, batch);
		writeTraitCollectionAsBatch(firestore, touchstonesAndConvictions, TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME, batch);

		// commit batch
		await batch.commit();
	} catch (error) {
		console.error(__filename, `Error writing character sheet data to firestore as a batch`, { error, data });
	}
}

function writeTraitCollectionAsBatch(
	firestore: Firestore,
	traitDataArray: iGeneralTraitData[],
	traitCollectionName: string,
	batch: FirestoreBatch
) {
	traitDataArray.forEach(traitData => {
		const traitDoc = firestore.doc(`${path}/${traitCollectionName}`);
		batch.set(traitDoc, traitData);
	});
}
