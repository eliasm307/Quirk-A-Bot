import { isCoreGameData } from '../../../../utils/type-predicates';
import { iGameData } from '../../../game/interfaces/game-interfaces';
import { DocumentDataReaderProps } from '../../Firestore/utils/assertDocumentExistsOnFirestore';

export default async function readGameDataFromFirestoreComposite({
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

  const gameData = coreDataDocument.data();

  // todo assert it is core game data
  if (!isCoreGameData(gameData)) {
    console.timeEnd(timerName);
    const error = `Core game data was read but format is invalid`;
    console.error(__filename, error, {
      __filename,
      error,
      coreGameData: gameData,
    });
    throw Error(error);
  }

  return gameData;

  /*
  const { description, id, gameMasters } = gameData;

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
  return {
    characterSheetIds,
    description,
    id,
    players: players,
    gameMasters,
  };
  */
}
