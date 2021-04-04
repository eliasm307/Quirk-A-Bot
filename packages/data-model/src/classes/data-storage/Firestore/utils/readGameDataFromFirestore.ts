import { PLAYER_COLLECTION_NAME } from 'src/constants';
import isCoreGameData from 'src/utils/type-predicates/isCoreGameData';
import isGamePlayerData from 'src/utils/type-predicates/isGamePlayerData';

import { Firestore } from '@quirk-a-bot/firebase-utils';

import { iGameData, iGamePlayerData } from '../../../game/declarations/game-interfaces';
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
    throw Error(`Cannot read document at path ${path} because it doesnt exist`);

  const coreGameData = coreDataDocument.data();

  // todo assert it is core game data
  if (!isCoreGameData(coreGameData)) {
    console.timeEnd(timerName);
    return Promise.reject({
      __filename,
      message: `Core game data was read but format is invalid`,
      coreGameData,
    });
  }

  const { description, id } = coreGameData;

  // todo create path should be a dependency
  const playerCollection = await firestore
    .collection(createPath(path, PLAYER_COLLECTION_NAME))
    .get();

  const players = [] as iGamePlayerData[];
  const characterSheetIds = [] as string[];

  playerCollection.forEach((snapshot) => {
    const playerData = snapshot.data();

    // todo assert player data is correct format
    if (!isGamePlayerData(playerData)) {
      console.timeEnd(timerName);
      return Promise.reject({
        error: `Data for player document with id ${snapshot.id} is not valid player data`,
        playerData,
      });
    }

    players.push(playerData);
    characterSheetIds.push(playerData.id);
  });

  console.timeEnd(timerName);
  return {
    characterSheetIds,
    description,
    id,
    players,
  };
}
