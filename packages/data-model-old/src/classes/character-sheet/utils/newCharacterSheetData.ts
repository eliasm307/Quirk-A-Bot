import { STRING_TRAIT_DEFAULT_VALUE } from '../../../../../common/src/constants';
import { iHasId } from '../../data-storage/interfaces/data-storage-interfaces';
import { iCharacterSheetData } from '../interfaces/character-sheet-interfaces';

export default function newCharacterSheetData({
  id,
}: iHasId): iCharacterSheetData {
  return {
    id,
    bloodPotency: { name: "Blood Potency", value: 0 },
    health: { name: "Health", value: 0 },
    humanity: { name: "Humanity", value: 0 },
    hunger: { name: "Hunger", value: 0 },
    willpower: { name: "Willpower", value: 0 },
    name: { name: "Name", value: STRING_TRAIT_DEFAULT_VALUE },
    sire: { name: "Sire", value: STRING_TRAIT_DEFAULT_VALUE },
    clan: { name: "Clan", value: STRING_TRAIT_DEFAULT_VALUE },
    attributes: [],
    disciplines: [],
    skills: [],
    touchstonesAndConvictions: [],
  };
}
