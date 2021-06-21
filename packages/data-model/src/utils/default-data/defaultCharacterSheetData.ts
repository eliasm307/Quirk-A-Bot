import { DEFAULT_CHARACTER_IMAGE_URL } from '@quirk-a-bot/common';

import {
  iCharacterSheetData,
} from '../../classes/character-sheet/interfaces/character-sheet-interfaces';

export default function defaultCharacterSheetData(
  id: string
): iCharacterSheetData {
  return {
    attributes: {},
    coreNumberTraits: {},
    coreStringTraits: {},
    id,
    disciplines: {},
    skills: {},
    touchstonesAndConvictions: {},
    img: DEFAULT_CHARACTER_IMAGE_URL,
  };
}
