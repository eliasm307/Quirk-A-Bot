import { AttributeCategory, AttributeName } from './../declarations/types';
export default function getAttributeCategory(name: AttributeName): AttributeCategory {
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
