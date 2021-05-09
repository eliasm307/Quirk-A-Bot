import { iGameData } from '../../../game/interfaces/game-interfaces';
import { DocumentDataWriterProps } from '../../Firestore/utils/assertDocumentExistsOnFirestore';

export default async function writeGameDataToFirestoreComposite({
  data,
  firestore,
  path,
}: DocumentDataWriterProps<iGameData>) {
  const timerName = `Time to write game data at path ${path}`;
  console.time(timerName);

  try {
    const gameDocRef = firestore.doc(path);

    // create new firestore batch
    const batch = firestore.batch();

    // write core data
    batch.set(gameDocRef, data);

    // set each players data
    /*
    players.forEach((playerData) => {
      const playerDocRef = firestore.doc(
        `${path}/${PLAYER_COLLECTION_NAME}/${playerData.id}`
      );
      batch.set(playerDocRef, playerData);
    });
    */

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
