import { iCharacterSheetData } from "../../character-sheet/interfaces/character-sheet-interfaces";
import { BaseModel } from "../interfaces/interfaces";

export default class CharacterSheetFirestoreCompositeModel
  implements BaseModel<iCharacterSheetData>
{
  update(updates: Partial<Omit<iCharacterSheetData, "id">>): void {
    throw new Error("Method not implemented.");
  }
}
