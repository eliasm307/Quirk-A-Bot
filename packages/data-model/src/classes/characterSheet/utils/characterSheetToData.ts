import { iCharacterSheet, iCharacterSheetData } from '../interfaces/character-sheet-interfaces';

export default function characterSheetToData( characterSheet: iCharacterSheet ): iCharacterSheetData {
  	const data: iCharacterSheetData = {
			id: characterSheet.id,

			// trait collections
			attributes: characterSheet.attributes.toJson(),
			disciplines: characterSheet.disciplines.toJson(),
			skills: characterSheet.skills.toJson(),
			touchstonesAndConvictions: characterSheet.touchstonesAndConvictions.toJson(),

			// core string traits
			clan: characterSheet.clan.toJson(),
			name: characterSheet.name.toJson(),
			sire: characterSheet.sire.toJson(),

			// core number traits
			health: characterSheet.health.toJson(),
			humanity: characterSheet.humanity.toJson(),
			hunger: characterSheet.hunger.toJson(),
			bloodPotency: characterSheet.bloodPotency.toJson(),
			willpower: characterSheet.willpower.toJson(),
		};
		// console.log(__filename, { data });
		return data;
}
