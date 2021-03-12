import { iCharacterSheetData } from '../../../characterSheet/interfaces/character-sheet-interfaces';
import exportDataToFile from './exportDataToFile';

export default function saveCharacterSheetToFile(data: iCharacterSheetData, savePath: string): boolean {
	// console.warn(`Saving character sheet with id ${data.discordUserId} to file ${savePath} `, { savePath, data });
	if (exportDataToFile(data, savePath)) {
		return true;
	} else {
		console.error(`Error saving character sheet to file`, { savePath, data });
		return false;
	}
}
