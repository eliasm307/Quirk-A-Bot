import { PLAYER_COLLECTION_NAME } from 'src/constants';

import { iGameData } from '../../../game/interfaces';
import { iHasFirestore } from '../../interfaces/data-storage-interfaces';
import { DocumentDataWriterProps } from './assertDocumentExistsOnFirestore';

export default async function writeGameDataToFirestore({
  data,
  firestore,
  path,
}: DocumentDataWriterProps<iGameData>) {
  const timerName = `Time to write game data at path ${path}`;
  console.time(timerName);

  const { players, characterSheetIds, ...coreData } = data;

  try {
    const gameDocRef = firestore.doc(path);

    // create new firestore batch
    const batch = firestore.batch();

    // write core data
    batch.set(gameDocRef, coreData);

    // set each players data
    players.forEach((playerData) => {
      const playerDocRef = firestore.doc(
        `${path}/${PLAYER_COLLECTION_NAME}/${playerData.id}`
      );
      batch.set(playerDocRef, playerData);
    });

    // commit batch
    await batch.commit();
  } catch (error) {
    console.error(
      __filename,
      `Error writing game data to firestore as a batch`,
      { error, data }
    );
  } finally {
    console.timeEnd(timerName);
  }
}
