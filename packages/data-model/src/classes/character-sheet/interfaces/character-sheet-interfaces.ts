/* eslint-disable no-use-before-define */
import {
  AttributeName, CoreStringTraitName, DisciplineName, SkillName,
} from 'packages/common/src/declarations';

import { iHasCleanUp, iHasGetData, iHasId, iHasParentPath } from '../../../declarations/interfaces';
import { ClanName, CoreNumberTraitName } from '../../../declarations/types';
import { BaseModelReader } from '../../data-models/interfaces/interfaces';
import {
  iHasCharacterSheetDataStorage, iHasDataStorageFactory,
} from '../../data-storage/interfaces/data-storage-interfaces';
import { iCharacterData } from '../../game/interfaces/game-player-interfaces';
import { iHasCharacterSheetLogReporter } from '../../log/interfaces/log-interfaces';
import {
  iAttributeTraitCollection, iDisciplineTraitCollection, iSkillTraitCollection,
  iTouchStoneOrConvictionCollection,
} from '../../traits/interfaces/trait-collection-interfaces';
import {
  iAttributeData, iCoreNumberTrait, iCoreNumberTraitData, iCoreStringTrait, iCoreStringTraitData,
  iDisciplineData, iSkillData, iTouchStoneOrConvictionData,
} from '../../traits/interfaces/trait-interfaces';

export interface iHasCharacterSheet {
  characterSheet: iCharacterSheet;
}
export interface iHasCharacterSheetData {
  characterSheetData: iCharacterSheetDataOLD;
}

export interface iCharacterSheetLoaderProps
  extends iHasId,
    iHasDataStorageFactory,
    iHasParentPath {}

// todo move to character sheet file
export interface iCharacterSheetProps
  extends iCharacterSheetLoaderProps,
    iHasParentPath,
    iHasCharacterSheetDataStorage {}

/** The basic shape of a charactersheet */
export interface iCharacterSheetShape {
  readonly id: string;

  attributes: unknown;
  bloodPotency: unknown;
  clan: unknown;
  disciplines: unknown;
  health: unknown;
  humanity: unknown;
  hunger: unknown;
  // todo add user aliases (ie known discord names to be added by bot)
  name: unknown;
  sire: unknown;
  skills: unknown;
  touchstonesAndConvictions: unknown;
  willpower: unknown;
}

/** The shape of character sheet as plain JSON data */
export interface iCharacterSheetDataOLD extends iCharacterSheetShape {
  attributes: iAttributeData[];
  bloodPotency: iCoreNumberTraitData;
  // ? should this be just a string?
  clan: iCoreStringTraitData<ClanName>;
  disciplines: iDisciplineData[];
  // ? should this be just a string?
  health: iCoreNumberTraitData;
  humanity: iCoreNumberTraitData;
  hunger: iCoreNumberTraitData;
  name: iCoreStringTraitData<string>;
  sire: iCoreStringTraitData<string>;
  skills: iSkillData[];
  touchstonesAndConvictions: iTouchStoneOrConvictionData[];
  willpower: iCoreNumberTraitData;
}

/** The shape of character sheet as plain JSON data, with top level trait collections */
export interface iCharacterSheetData extends Omit<iCharacterData, "name"> {
  attributes: Partial<Record<AttributeName, iAttributeData>>;
  coreNumberTraits: Record<CoreNumberTraitName, iCoreNumberTraitData>;
  coreStringTraits: Record<CoreStringTraitName, iCoreStringTraitData> & {
    Clan: iCoreStringTraitData<ClanName>;
  };
  disciplines: Partial<Record<DisciplineName, iDisciplineData>>;
  /*
  health: iCoreNumberTraitData;
  humanity: iCoreNumberTraitData;
  hunger: iCoreNumberTraitData;
  name: iCoreStringTraitData<string>;
  sire: iCoreStringTraitData<string>;
  willpower: iCoreNumberTraitData;
  bloodPotency: iCoreNumberTraitData;
  */
  skills: Partial<Record<SkillName, iSkillData>>;
  touchstonesAndConvictions: Partial<
    Record<string, iTouchStoneOrConvictionData>
  >;
}

/** The shape of a character sheet object instance */
export interface iCharacterSheet
  extends iCharacterSheetShape,
    iHasGetData<iCharacterSheetDataOLD>,
    iHasCharacterSheetLogReporter,
    iHasCleanUp,
    iHasParentPath {
  // todo delete, not required anymore
  attributes: iAttributeTraitCollection;
  bloodPotency: iCoreNumberTrait;
  // ? should this be just a string?
  clan: iCoreStringTrait<ClanName>;
  disciplines: iDisciplineTraitCollection;
  // ? should this be just a string?
  health: iCoreNumberTrait;
  humanity: iCoreNumberTrait;
  hunger: iCoreNumberTrait;
  name: iCoreStringTrait<string>;
  path: string;
  // todo allow this to specify using ClanName type union
  sire: iCoreStringTrait<string>;
  skills: iSkillTraitCollection;
  touchstonesAndConvictions: iTouchStoneOrConvictionCollection;
  willpower: iCoreNumberTrait;
}

export interface iCharacterSheetViewModel
  extends BaseModelReader<iCharacterSheetDataOLD> {
  setAttribute(props: iAttributeData): void;
  setCoreNumberTrait(props: iCoreNumberTraitData): void;
  setCoreStringTrait(props: iCoreStringTraitData): void;
  setSkill(props: iSkillData): void;
  setTouchstoneAndConvictions(props: iTouchStoneOrConvictionData): void;
}
