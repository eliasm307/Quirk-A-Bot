import { Observable } from 'rxjs';

import { UID } from '@quirk-a-bot/common';

import { iHasId } from '../../../declarations/interfaces';
import { iCharacterSheetData } from '../../character-sheet/interfaces/character-sheet-interfaces';
import numberTraitIsValid from '../../character-sheet/utils/numberTraitIsValid';
import { BaseModelReader, BaseModelWriter } from '../../data-models/interfaces/interfaces';
import {
  iAttributeData, iCoreNumberTraitData, iCoreStringTraitData, iSkillData,
  iTouchStoneOrConvictionData,
} from '../../traits/interfaces/trait-interfaces';
import { iCharacterSheetViewModel } from './interfaces';

interface Props extends iHasId {
  modelReader?: BaseModelReader<iCharacterSheetData>;
  modelWriter?: BaseModelWriter<iCharacterSheetData>;
}

export default class CharacterSheetViewModel
  implements iCharacterSheetViewModel
{
  protected static instances: Map<UID, CharacterSheetViewModel> = new Map();

  #modelReader?: BaseModelReader<iCharacterSheetData>;
  #modelWriter?: BaseModelWriter<iCharacterSheetData>;
  change$: Observable<iCharacterSheetData | undefined> | null;
  id: string;

  private constructor(props: Props) {
    const { modelReader, modelWriter, id } = props;
    this.id = id;
    this.#modelReader = modelReader;
    this.#modelWriter = modelWriter;
    this.change$ = modelReader?.change$ || null;
  }

  /** Loads an existing instance if available */
  static load(props: Props): CharacterSheetViewModel {
    const { id } = props;

    // todo should method to load an existing model and to initialise a new model be different? ie to initialise more information could be required

    // check if instance exists
    const existingInstance = CharacterSheetViewModel.instances.get(id);
    if (existingInstance) return existingInstance;

    // create new instance and save instance
    const newInstance = new CharacterSheetViewModel(props);
    CharacterSheetViewModel.instances.set(id, newInstance);
    return newInstance;
  }

  dispose(): void {
    if (this.#modelReader) this.#modelReader.dispose();
    CharacterSheetViewModel.instances.delete(this.id);
  }

  setAttribute(data: iAttributeData): void {
    this.assertAttributeIsValid(data);

    const { name } = data;

    const updates: Partial<Omit<iCharacterSheetData, "id">> = {
      attributes: { [name]: data },
    };

    this.updateModel(updates);
  }

  setCoreNumberTrait(data: iCoreNumberTraitData): void {
    this.assertCoreNumberTraitIsValid(data);

    const { name } = data;

    const updates: Partial<Omit<iCharacterSheetData, "id">> = {
      coreNumberTraits: { [name]: data },
    };

    this.updateModel(updates);
  }

  setCoreStringTrait(data: iCoreStringTraitData<string>): void {
    this.assertCoreStringTraitIsValid(data);

    const { name } = data;

    const updates: Partial<Omit<iCharacterSheetData, "id">> = {
      coreStringTraits: { [name]: data },
    };

    this.updateModel(updates);
  }

  setSkill(data: iSkillData): void {
    this.assertSkillIsValid(data);

    const { name } = data;

    const updates: Partial<Omit<iCharacterSheetData, "id">> = {
      skills: { [name]: data },
    };

    this.updateModel(updates);
  }

  setTouchstoneAndConviction(data: iTouchStoneOrConvictionData): void {
    const { name, value } = data;

    if (!name || !value)
      throw Error(
        `Could not set touchstone/conviction trait because name or value is blank, name: ${name} value: ${value}`
      );

    const updates: Partial<Omit<iCharacterSheetData, "id">> = {
      touchstonesAndConvictions: { [name]: data },
    };

    this.updateModel(updates);
  }

  private assertAttributeIsValid(data: iAttributeData): void {
    const { name, value } = data;

    if (!numberTraitIsValid({ data, max: 5, min: 1 }))
      throw Error(`Could not set attribute ${name} to ${value}`);
  }

  private assertCoreNumberTraitIsValid(data: iCoreNumberTraitData) {
    const { name, value } = data;

    if (
      !numberTraitIsValid({
        data,
        max: {
          "Blood Potency": 10,
          Health: 5,
          Humanity: 10,
          Hunger: 5,
          Willpower: 10,
        },
        min: 0,
      })
    )
      throw Error(`Could not set core number trait ${name} to ${value}`);
  }

  private assertCoreStringTraitIsValid(data: iCoreStringTraitData) {
    const { name, value } = data;

    if (!value)
      throw Error(`Could not set core String trait ${name} to empty string`);
  }

  private assertSkillIsValid(data: iSkillData): void {
    const { name, value } = data;

    if (!numberTraitIsValid({ data, max: 5, min: 0 }))
      throw Error(`Could not set Skill ${name} to ${value}`);
  }

  private updateModel(updates: Partial<Omit<iCharacterSheetData, "id">>): void {
    if (this.#modelWriter) this.#modelWriter.update(updates);
    else
      console.warn(
        `Could not update character sheet with id ${this.id} because you don't have write access`
      );
  }
}
