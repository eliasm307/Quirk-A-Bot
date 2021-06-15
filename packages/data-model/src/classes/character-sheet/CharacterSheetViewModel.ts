import { Observable } from 'rxjs';

import { UID } from '@quirk-a-bot/common';

import { iHasId } from '../../declarations/interfaces';
import { CharacterSheetModel } from '../data-models/interfaces/interfaces';
import {
  iAttributeData, iCoreNumberTraitData, iCoreStringTraitData, iSkillData,
  iTouchStoneOrConvictionData,
} from '../traits/interfaces/trait-interfaces';
import {
  iCharacterSheetData, iCharacterSheetViewModel,
} from './interfaces/character-sheet-interfaces';

interface Props extends iHasId {
  model: CharacterSheetModel;
}

export default class CharacterSheetViewModel
  implements iCharacterSheetViewModel
{
  protected static instances: Map<UID, CharacterSheetViewModel> = new Map();

  #model: CharacterSheetModel;
  changes: Observable<iCharacterSheetData | undefined>;

  private constructor(props: Props) {
    const { model } = props;

    this.#model = model;
    this.changes = model.changes;
  }

  /** loads an existing instance if available */
  static load(props: Props): CharacterSheetViewModel {
    const { id } = props;

    // check if instance exists
    const existingInstance = CharacterSheetViewModel.instances.get(id);
    if (existingInstance) return existingInstance;

    // create new instance and save instance
    const newInstance = new CharacterSheetViewModel(props);
    CharacterSheetViewModel.instances.set(id, newInstance);
    return newInstance;
  }

  dispose(): void {
    throw new Error("Method not implemented.");
  }

  setAttribute(props: iAttributeData): void {
    throw new Error("Method not implemented.");
  }

  setCoreNumberTrait(props: iCoreNumberTraitData): void {
    throw new Error("Method not implemented.");
  }

  setCoreStringTrait(props: iCoreStringTraitData<string>): void {
    throw new Error("Method not implemented.");
  }

  setSkill(props: iSkillData): void {
    throw new Error("Method not implemented.");
  }

  setTouchstoneAndConvictions(props: iTouchStoneOrConvictionData): void {
    throw new Error("Method not implemented.");
  }
}
