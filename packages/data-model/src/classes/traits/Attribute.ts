import { iBaseTraitProps, iTrait } from './../../declarations/interfaces';
import { AttributeName } from '../../declarations/types';
import { iAttribute, iCharacterSheet } from '../../declarations/interfaces';
import { AttributeCategory } from '../../declarations/types';
import BaseTrait from './BaseTrait';

interface iProps<T extends iTrait> extends iBaseTraitProps<T> {}

export default class Attribute extends BaseTrait<iAttribute> implements iAttribute {
	readonly category: AttributeCategory;

	constructor(props: iProps<iAttribute>) {
		super(props);
		this.category = this.getCategory(props.name);
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
