import { Observable } from 'rxjs';

import { GameId, UID } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iUserData } from '../../user/interfaces';

// ! this simplicity allows the implementation of models in different data storages to be more flexible e.g. the structure of local file based storage and Firestore by document is quite different and has very little overlaps which cause issues if you try to make one size fits all granular interfaces

/** Interface for reading a model */
export interface BaseModelReader<T> extends iHasId {
  readonly data$: Observable<T | undefined> | null;

  dispose(): void;
}

export interface iCharacterSheetModelReader
  extends BaseModelReader<iCharacterSheetData> {}

export interface iUserModelReader extends BaseModelReader<iUserData> {
  readonly gameCollectionData$: Observable<iGameData[]>;
}

export interface iGameModelReader extends BaseModelReader<iGameData> {
  /** Stream of data of the game character collection */
  readonly characterCollectionData$: Observable<iCharacterSheetData[]> | null;
}

/** Interface for mutating/updating a model */
export interface BaseModelWriter<T> extends iHasId {
  update(newData: Partial<Omit<T, "id">>): void;
}

export interface iCharacterSheetModelWriter
  extends BaseModelWriter<iCharacterSheetData> {}

export interface iUserModelWriter extends BaseModelWriter<iUserData> {}

export interface iGameModelWriter extends BaseModelWriter<iGameData> {
  addCharacter(id: UID): Promise<void>;
  addGameAdmin(id: UID): Promise<void>;
  removeCharacter(id: UID): Promise<void>;
  removeGameAdmin(id: UID): Promise<void>;
}

/**
 * Simplified model that only accepts updates and provides change notifications.
 * Model responsibilities are to facilitate CRUD operations from/to data storage and optimise that.
 */
export interface BaseModel<T> extends BaseModelReader<T>, BaseModelWriter<T> {}

/** Internal utils implemented for a specific data storage */
export interface ModelUtils {
  getGameData(id: GameId): Promise<iGameData | null>;
}

/** Produces model readers/writers specific to a data storage */
export interface ModelFactory {
  readonly utils: ModelUtils;

  getCharacterSheetModelReader(
    gameId: GameId,
    characterId: UID
  ): iCharacterSheetModelReader;
  getCharacterSheetModelWriter(
    gameId: GameId,
    characterId: UID
  ): iCharacterSheetModelWriter;
  getGameModelReader(id: GameId): iGameModelReader;
  getGameModelWriter(id: GameId): iGameModelWriter;
  getUserModelReader(id: UID): iUserModelReader;
  getUserModelWriter(id: UID): iUserModelWriter;
}
