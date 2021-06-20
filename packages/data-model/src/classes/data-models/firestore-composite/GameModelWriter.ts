import { firestore, GAMES_COLLECTION_NAME, newGuid, UID } from '@quirk-a-bot/common';

import { iGameData } from '../../game/interfaces/game-interfaces';
import AbstractDocumentWriter from './AbstractDocumentWriter';

interface CreateGameProps {
  creatorId: UID;
  description: string;
  gameCollectionPath?: string;
}

export const createGame = async ({
  creatorId,
  description,
  gameCollectionPath = GAMES_COLLECTION_NAME,
}: CreateGameProps): Promise<void> => {
  const newGameId = newGuid();

  const newGameData: iGameData = {
    description,
    id: newGameId,
    created: new Date().toLocaleString(),
    createdBy: creatorId,
    users: { [creatorId]: { isAdmin: true } },
  };

  return firestore
    .collection(gameCollectionPath)
    .doc(newGameId)
    .set(newGameData);
};

export default class GameFirestoreCompositeModelWriter extends AbstractDocumentWriter<iGameData> {}
