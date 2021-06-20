import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import { BaseModelReader } from '../../data-models/interfaces';
import {
  iAttributeData, iCoreNumberTraitData, iCoreStringTraitData, iSkillData,
  iTouchStoneOrConvictionData,
} from '../../traits/interfaces/trait-interfaces';

export interface iCharacterSheetViewModel
  extends BaseModelReader<iCharacterSheetData> {
  setAttribute(data: iAttributeData): void;
  setCoreNumberTrait(data: iCoreNumberTraitData): void;
  setCoreStringTrait(data: iCoreStringTraitData): void;
  setSkill(data: iSkillData): void;
  setTouchstoneAndConviction(data: iTouchStoneOrConvictionData): void;
}
