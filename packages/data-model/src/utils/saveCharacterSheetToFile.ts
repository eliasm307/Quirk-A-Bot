import { iCharacterSheetData } from '../declarations/interfaces/character-sheet-interfaces';
import exportDataToFile from './exportDataToFile';

export default function saveCharacterSheetToFile(data: iCharacterSheetData, savePath: string): boolean {
	return exportDataToFile(data, savePath);
}
