import { GameId, UID } from '@quirk-a-bot/common/dist';

import {
  iCharacterSheetModelReader, iCharacterSheetModelWriter, iGameModelReader, iGameModelWriter,
  iUserModelReader, iUserModelWriter, ModelFactory, ModelUtils,
} from '../interfaces';
import CharacterSheetFirestoreCompositeModelReader from './CharacterSheetModelReader';
import FirestoreCompositeModelUtils from './ModelUtils';

export default class FirestoreCompositeModelFactory implements ModelFactory {
  readonly utils: ModelUtils;

  constructor() {
    this.utils = new FirestoreCompositeModelUtils();
  }

  getCharacterSheetModelReader(
    gameId: GameId,
    characterId: UID
  ): iCharacterSheetModelReader {
    const gamePath;

    return new CharacterSheetFirestoreCompositeModelReader({
      id: characterId,
      parentPath,
    });
  }

  getCharacterSheetModelWriter(id: string): iCharacterSheetModelWriter {
    throw new Error("Method not implemented.");
  }

  getGameModelReader(id: string): iGameModelReader {
    throw new Error("Method not implemented.");
  }

  getGameModelWriter(id: string): iGameModelWriter {
    throw new Error("Method not implemented.");
  }

  getUserModelReader(id: string): iUserModelReader {
    throw new Error("Method not implemented.");
  }

  getUserModelWriter(id: string): iUserModelWriter {
    throw new Error("Method not implemented.");
  }
}
