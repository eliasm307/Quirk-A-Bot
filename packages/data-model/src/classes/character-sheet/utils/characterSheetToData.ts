import { iCharacterSheet, iCharacterSheetData } from '../interfaces/character-sheet-interfaces';

export default function characterSheetToData(
  characterSheet: iCharacterSheet
): iCharacterSheetData {
  const data: iCharacterSheetData = {
    id: characterSheet.id,

    // trait collections
    attributes: characterSheet.attributes.data(),
    disciplines: characterSheet.disciplines.data(),
    skills: characterSheet.skills.data(),
    touchstonesAndConvictions: characterSheet.touchstonesAndConvictions.data(),

    // core string traits
    clan: characterSheet.clan.data(),
    name: characterSheet.name.data(),
    sire: characterSheet.sire.data(),

    // core number traits
    health: characterSheet.health.data(),
    humanity: characterSheet.humanity.data(),
    hunger: characterSheet.hunger.data(),
    bloodPotency: characterSheet.bloodPotency.data(),
    willpower: characterSheet.willpower.data(),
  };
  // console.log(__filename, { data });
  return data;
}
