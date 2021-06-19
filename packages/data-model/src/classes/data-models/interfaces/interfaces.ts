import { Observable } from 'rxjs';

import { iHasId } from '../../../declarations/interfaces';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';

// ! this simplicity allows the implementation of models in different data storages to be more flexible e.g. the structure of local file based storage and Firestore by document is quite different and has very little overlaps which cause issues if you try to make one size fits all granular interfaces

/** Interface for reading a model */
export interface BaseModelReader<T> extends iHasId {
  readonly change$: Observable<T | undefined> | null;

  dispose(): void;
}

export interface GameModelReader extends BaseModelReader<iGameData> {
  readonly characterChange$: Observable<
    iCharacterSheetData[] | undefined
  > | null;
}

/** Interface for mutating/updating a model */
export interface BaseModelWriter<T> extends iHasId {
  set(newData: Partial<Omit<T, "id">>): void;
}

/**
 * Simplified model that only accepts updates and provides change notifications.
 * Model responsibilities are to facilitate CRUD operations from/to data storage and optimise that.
 */
export interface BaseModel<T> extends BaseModelReader<T>, BaseModelWriter<T> {}
