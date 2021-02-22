import { AttributeName } from '../../declarations/types';
import { iAttribute, iCharacterSheet } from '../../declarations/interfaces';
import { AttributeCategory } from '../../declarations/types';
import BaseTrait from './BaseTrait';

export default class Attribute extends BaseTrait<iAttribute> implements iAttribute {
	readonly category: AttributeCategory;

	constructor(characterSheet: iCharacterSheet, name: AttributeName, value: number = 0) {
		super(characterSheet, name, value);
		this.category = this.getCategory(name);
	}

	private getCategory(name: AttributeName): AttributeCategory {
		switch (name) {
			case 'Strength':
			case 'Dexterity':
			case 'Stamina':
				return 'Physical';
			case 'Charisma':
			case 'Manipulation':
			case 'Composure':
				return 'Social';
			case 'Intelligence':
			case 'Wits':
			case 'Resolve':
				return 'Mental';
			default:
				throw Error(`${__filename} ERROR: Unknown attribute name "${name}"`);
		}
	}
}
