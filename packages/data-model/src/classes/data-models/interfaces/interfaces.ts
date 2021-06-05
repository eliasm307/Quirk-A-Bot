import { iCharacterSheetData } from "../../character-sheet/interfaces/character-sheet-interfaces";

export interface BaseModel<T> {
  update(updates: Partial<Omit<T, "id">>): void;
}
