import {
  CHARACTER_COLLECTION_NAME, firestore, FirestoreCollectionReference, GAMES_COLLECTION_NAME,
  newGuid, UID,
} from '@quirk-a-bot/common';

import defaultCharacterSheetData from '../../../utils/default-data/defaultCharacterSheetData';
import { createPath } from '../../data-storage/utils/createPath';
import { iGameData } from '../../game/interfaces/game-interfaces';
import defaultCharacterData from '../../game/utils/defaultCharacterData';
import { iGameModelWriter } from '../interfaces';
import AbstractDocumentWriter from './AbstractDocumentWriter';
import { AbstractDocumentWriterProps } from './AbstractDocumentWriter/interfaces';

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

export default class GameFirestoreCompositeModelWriter
  extends AbstractDocumentWriter<iGameData>
  implements iGameModelWriter
{
  protected characterCollectionRef: FirestoreCollectionReference;

  constructor(props: AbstractDocumentWriterProps) {
    super(props);

    const characterCollectionPath = createPath(
      this.path,
      CHARACTER_COLLECTION_NAME
    );

    this.characterCollectionRef = firestore.collection(characterCollectionPath);
  }

  async addCharacter(id: string): Promise<void> {
    const characterDocRef = this.characterCollectionRef.doc(id);

    // check if character already exists
    const characterSnapshot = await characterDocRef.get();
    if (characterSnapshot.exists)
      return console.warn(
        `Cannot add character because character already exists`,
        { characterData: characterSnapshot.data() }
      );

    // add character sheet
    await characterDocRef.set(defaultCharacterSheetData(id));

    // add character to game document
    const updates: Partial<iGameData> = {
      users: { [id]: { isCharacter: true } },
    };
    this.update(updates);
  }

  async addGameAdmin(id: string): Promise<void> {
    // add to game document
    const updates: Partial<iGameData> = {
      users: { [id]: { isAdmin: true } },
    };
    this.update(updates);
  }

  async removeCharacter(id: string): Promise<void> {
    const characterDocRef = this.characterCollectionRef.doc(id);

    // delete character sheet
    await characterDocRef.delete();

    // remove character from game document
    const updates: Partial<iGameData> = {
      users: { [id]: { isCharacter: false } },
    };
    this.update(updates);
  }

  async removeGameAdmin(id: string): Promise<void> {
    // remove from game document
    const updates: Partial<iGameData> = {
      users: { [id]: { isAdmin: false } },
    };
    this.update(updates);
  }
}
