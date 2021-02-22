import { iTouchStoneOrConviction, iCharacterSheet } from './../declarations/interfaces';
export default class TouchStoneOrConviction implements iTouchStoneOrConviction {
	name: string;
	value: string;

	constructor(characterSheet: iCharacterSheet, name: string, value: string = '') {
		this.name = name;
		this.value = value;
	}
}
