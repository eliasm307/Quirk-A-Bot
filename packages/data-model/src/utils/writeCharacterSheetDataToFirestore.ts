import path from 'node:path';
import {
	ATTRIBUTE_COLLECTION_NAME,
	DISCIPLINE_COLLECTION_NAME,
	SKILL_COLLECTION_NAME,
	TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME,
} from '../constants';
import { iCharacterSheetData } from '../declarations/interfaces/character-sheet-interfaces';
import { iGeneralTraitData } from '../declarations/interfaces/trait-interfaces';
import { Firestore, FirestoreBatch } from './firebase';

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
		clan,
		health,
		humanity,
		hunger,
		name,
		sire,
		willpower,
		bloodPotency,
	};

	try {
		const csDoc = firestore.doc(path);

		// create new firestore batch
		const batch = firestore.batch();

		// write core data
		batch.set(csDoc, coreData);

		// write trait collection data as firestore collections
		addTraitCollectionAsBatch(firestore, attributes, ATTRIBUTE_COLLECTION_NAME, batch);
		addTraitCollectionAsBatch(firestore, disciplines, DISCIPLINE_COLLECTION_NAME, batch);
		addTraitCollectionAsBatch(firestore, skills, SKILL_COLLECTION_NAME, batch);
		addTraitCollectionAsBatch(firestore, touchstonesAndConvictions, TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME, batch);

		// commit batch
		await batch.commit();
	} catch (error) {
		console.error(__filename, `Error writing character sheet data to firestore as a batch`, { error, data });
	}
}

function addTraitCollectionAsBatch(
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
