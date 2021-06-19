import { GameModelReader } from '../../data-models/interfaces/interfaces';

export interface iCharacterSheetViewModel extends GameModelReader {
  setDescription(description: string): void;
}
