import { PLAYER_COLLECTION_NAME } from '@quirk-a-bot/common';

import { isGameData, isGamePlayerData } from '../../../../utils/type-predicates';
import { iGameData } from '../../../game/interfaces/game-interfaces';
import { iCharacterData } from '../../../game/interfaces/game-player-interfaces';
import { createPath } from '../../utils/createPath';
import { DocumentDataReaderProps } from './assertDocumentExistsOnFirestore';

export default async function readGameDataFromFirestore({
  firestore,
  path,
}: DocumentDataReaderProps): Promise<iGameData> {
  const timerName = `Time to read game data at path ${path}`;
  console.time(timerName);

  // read core data first and confirm document exists
  const coreDataDocument = await firestore.doc(path).get();
  if (!coreDataDocument.exists)
    throw Error(
      `Cannot read document at path ${path} because it doesn't  exist`
    );

  const coreGameData = coreDataDocument.data();

  // assert it is core game data
  if (!isGameData(coreGameData)) {
    console.timeEnd(timerName);
    const error = `Core game data was read but format is invalid`;
    console.error(__filename, error, {
      __filename,
      error,
      coreGameData,
    });
    return Promise.reject(Error(error));
  }

  const { description, id, gameMasters } = coreGameData;

  // todo create path should be a dependency
  const playerCollection = await firestore
    .collection(createPath(path, PLAYER_COLLECTION_NAME))
    .get();

  const players = [] as iCharacterData[];
  const characterSheetIds = [] as string[];

  playerCollection.forEach((snapshot) => {
    const playerData = snapshot.data();

    // assert player data is correct format
    if (!isGamePlayerData(playerData)) {
      console.timeEnd(timerName);
      const error = `Data for player document with id ${snapshot.id} is not valid player data`;
      console.error(__filename, error, {
        playerData,
      });
      return Promise.reject(Error(error));
    }

    players.push(playerData);
    characterSheetIds.push(playerData.id);
  });

  console.timeEnd(timerName);

  throw Error(`Not implemented properly`);

  /*
  return {
    characterIds,
    description,
    id,
    // players: players,
    gameMasters,
  };
  */
}
