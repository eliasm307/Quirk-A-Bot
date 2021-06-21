import { GAMES_COLLECTION_NAME } from 'packages/common/src/constants';

import { GameId, UID } from '@quirk-a-bot/common/dist';

import {
  iCharacterSheetModelReader, iCharacterSheetModelWriter, iGameModelReader, iGameModelWriter,
  iUserModelReader, iUserModelWriter, ModelFactory, ModelUtils,
} from '../interfaces';
import CharacterSheetFirestoreCompositeModelReader from './CharacterSheetModelReader';
import CharacterSheetFirestoreCompositeModelWriter from './CharacterSheetModelWriter';
import GameFirestoreCompositeModelReader from './GameModelReader';
import GameFirestoreCompositeModelWriter from './GameModelWriter';
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
    const gamePath = this.utils.createPath(GAMES_COLLECTION_NAME, gameId);

    return new CharacterSheetFirestoreCompositeModelReader({
      id: characterId,
      parentPath: gamePath,
    });
  }

  getCharacterSheetModelWriter(
    gameId: GameId,
    characterId: UID
  ): iCharacterSheetModelWriter {
    const gamePath = this.utils.createPath(GAMES_COLLECTION_NAME, gameId);

    return new CharacterSheetFirestoreCompositeModelWriter({
      id: characterId,
      parentPath: gamePath,
    });
  }

  getGameModelReader(id: string): iGameModelReader {
    return new GameFirestoreCompositeModelReader({
      id,
      parentPath: GAMES_COLLECTION_NAME,
    });
  }

  getGameModelWriter(id: string): iGameModelWriter {
    return new GameFirestoreCompositeModelWriter({
      id,
      parentPath: GAMES_COLLECTION_NAME,
    });
  }

  getUserModelReader(id: string): iUserModelReader {
    throw new Error("Method not implemented.");
  }
}
