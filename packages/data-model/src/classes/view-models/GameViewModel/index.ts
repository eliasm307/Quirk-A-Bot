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
  characterCollectionData$: Observable<iCharacterSheetData[]> | null;
  data$: Observable<iGameData | undefined> | null;
  id: string;

  constructor({ modelReader, modelWriter, id }: Props) {
    this.id = id;
    this.data$ = modelReader?.data$ || null;
    this.characterCollectionData$ =
      modelReader?.characterCollectionData$ || null;

    this.#modelWriter = modelWriter || null;
    this.#modelReader = modelReader || null;
  }

  async addCharacter(id: string): Promise<void> {
    const updates: Partial<iGameData> = {
      users: { [id]: { isCharacter: true } },
    };

    this.updateModel(updates);
  }

  async addGameAdmin(id: string): Promise<void> {
    const updates: Partial<iGameData> = {
      users: { [id]: { isAdmin: true } },
    };

    this.updateModel(updates);
  }

  dispose(): void {
    this.#modelWriter?.dispose();
    this.#modelReader?.dispose();
  }

  async removeCharacter(id: string): Promise<void> {
    const updates: Partial<iGameData> = {
      users: { [id]: { isCharacter: false } },
    };

    this.updateModel(updates);
  }

  async removeGameAdmin(id: string): Promise<void> {
    const updates: Partial<iGameData> = {
      users: { [id]: { isAdmin: false } },
    };

    this.updateModel(updates);
  }

  setDescription(description: string): void {
    const updates: Partial<iGameData> = {
      description,
    };

    this.updateModel(updates);
  }

  private updateModel(updates: Partial<Omit<iGameData, "id">>): void {
    if (this.#modelWriter) this.#modelWriter.update(updates);
    else
      console.warn(
        `Could not update game with id ${this.id} because you don't have write access`
      );
  }
}
