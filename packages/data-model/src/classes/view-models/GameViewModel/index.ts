import { firestoreFieldValues } from 'packages/common/dist/src/FirebaseExports';
import { Observable } from 'rxjs';

import { iHasId } from '../../../declarations/interfaces';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import GameModelWriter from '../../data-models/firestore-composite/GameModelWriter';
import { iGameModelReader, iGameModelWriter } from '../../data-models/interfaces';
import { iGameData } from '../../game/interfaces/game-interfaces';
import { iGameViewModel } from './interfaces';

interface Props extends iHasId {
  modelReader?: iGameModelReader;
  modelWriter?: iGameModelWriter;
}

// todo test

export default class GameViewModel implements iGameViewModel {
  #modelReader: iGameModelReader | null;
  #modelWriter: iGameModelWriter | null;
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
    return this.#modelWriter
      ? this.#modelWriter.addCharacter(id)
      : console.warn(
          `Cannot add character because you don't have write access to game with id ${this.id}`
        );
  }

  async addGameAdmin(id: string): Promise<void> {
    return this.#modelWriter
      ? this.#modelWriter.addGameAdmin(id)
      : console.warn(
          `Cannot add game admin because you don't have write access to game with id ${this.id}`
        );
  }

  dispose(): void {
    // this.#modelWriter?.dispose();
    this.#modelReader?.dispose();
  }

  async removeCharacter(id: string): Promise<void> {
    return this.#modelWriter
      ? this.#modelWriter.removeCharacter(id)
      : console.warn(
          `Cannot remove character because you don't have write access to game with id ${this.id}`
        );
  }

  async removeGameAdmin(id: string): Promise<void> {
    return this.#modelWriter
      ? this.#modelWriter.removeGameAdmin(id)
      : console.warn(
          `Cannot remove game admin because you don't have write access to game with id ${this.id}`
        );
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
