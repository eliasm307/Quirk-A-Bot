import { firestoreFieldValues } from 'packages/common/dist/src/FirebaseExports';
import { Observable } from 'rxjs';

import { iHasId } from '../../../declarations/interfaces';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import GameModelWriter from '../../data-models/firestore-composite/GameModelWriter';
import { GameModelReader } from '../../data-models/interfaces/interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iGameViewModel } from './interfaces';

interface Props extends iHasId {
  modelReader?: GameModelReader;
  modelWriter?: GameModelWriter;
}

// todo test

export default class GameViewModel implements iGameViewModel {
  #modelReader: GameModelReader | null;
  #modelWriter: GameModelWriter | null;
  change$: Observable<iGameData | undefined> | null;
  characterCollectionChange$: Observable<iCharacterSheetData[]> | null;
  id: string;

  constructor({ modelReader, modelWriter, id }: Props) {
    this.id = id;
    this.change$ = modelReader?.change$ || null;
    this.characterCollectionChange$ =
      modelReader?.characterCollectionChange$ || null;

    this.#modelWriter = modelWriter || null;
    this.#modelReader = modelReader || null;
  }

  async addCharacter(id: string): Promise<void> {
    const updates: Partial<iGameData> = { characterIds: { [id]: true } };

    this.#modelWriter?.update(updates);
  }

  async addGameMaster(id: string): Promise<void> {
    const updates: Partial<iGameData> = { gameMasterIds: { [id]: true } };

    this.#modelWriter?.update(updates);
  }

  dispose(): void {
    this.#modelWriter?.dispose();
    this.#modelReader?.dispose();
  }

  async removeCharacter(id: string): Promise<void> {
    const updates: Partial<iGameData> = {
      characterIds: { [id]: firestoreFieldValues.delete },
    };

    this.#modelWriter?.update(updates);
  }

  async removeGameMaster(id: string): Promise<void> {
    const updates: Partial<iGameData> = {
      gameMasterIds: { [id]: firestoreFieldValues.delete },
    };

    this.#modelWriter?.update(updates);
  }

  setDescription(description: string): void {
    const updates: Partial<iGameData> = {
      description,
    };

    this.#modelWriter?.update(updates);
  }
}
