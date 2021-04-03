import { iHasPath } from 'packages/data-model/src/declarations/interfaces';

import { Firestore } from '@quirk-a-bot/firebase-utils/src';

import { iGeneralTraitData } from '../../../traits/interfaces/trait-interfaces';
import { iHasFirestore, iHasId } from '../../interfaces/data-storage-interfaces';

  iCharacterSheetData
} from '../../../character-sheet/interfaces/character-sheet-interfaces';
export default async function writeCharacterSheetDataToFirestore(
	firestore: Firestore,
	characterSheetDocpath: string,
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

	const timerName = `Time to write character sheet data at path ${characterSheetDocpath}`;
	console.time(timerName);
	try {
		const csDoc = firestore.doc(characterSheetDocpath);

		// create new firestore batch
		const batch = firestore.batch();

		// write core data
		batch.set(csDoc, coreData);

		// write trait collection data as firestore collections
		writeTraitCollectionAsBatch(firestore, coreTraits, characterSheetDocpath, CORE_TRAIT_COLLECTION_NAME, batch);
		writeTraitCollectionAsBatch(firestore, attributes, characterSheetDocpath, ATTRIBUTE_COLLECTION_NAME, batch);
		writeTraitCollectionAsBatch(firestore, disciplines, characterSheetDocpath, DISCIPLINE_COLLECTION_NAME, batch);
		writeTraitCollectionAsBatch(firestore, skills, characterSheetDocpath, SKILL_COLLECTION_NAME, batch);
		writeTraitCollectionAsBatch(
			firestore,
			touchstonesAndConvictions,
			characterSheetDocpath,
			TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME,
			batch
		);

		// commit batch
		await batch.commit();
		console.timeEnd(timerName);
	} catch (error) {
		console.error(__filename, `Error writing character sheet data to firestore as a batch`, { error, data });
		console.timeEnd(timerName);
	}
}

function writeTraitCollectionAsBatch(
	firestore: Firestore,
	traitDataArray: iGeneralTraitData[],
	characterSheetDocpath: string,
	traitCollectionName: string,
	batch: FirestoreBatch
) {
	traitDataArray.forEach(traitData => {
		const traitDoc = firestore.doc(`${characterSheetDocpath}/${traitCollectionName}/${traitData.name}`);
		batch.set(traitDoc, traitData);
	});
}
