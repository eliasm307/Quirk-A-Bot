import { iBaseTraitProps, iTraitData, iNumberValue, iAbstractNumberTraitProps } from '../../declarations/interfaces/trait-interfaces';
import { AttributeName } from '../../declarations/types';
import { iAttributeData } from '../../declarations/interfaces/trait-interfaces';
import { AttributeCategory } from '../../declarations/types';
import BaseTrait from './BaseTrait';
import AbstractNumberTrait from './NumberTrait';

export default class Attribute extends AbstractNumberTrait<iAttributeData> implements iAttributeData {
	readonly category: AttributeCategory;

	constructor(props: iBaseTraitProps<iAttributeData>) {
		super({ ...props, max: 5, min: 1 }); // add missing number trait props
		const { name } = props;
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
	toJson(): iAttributeData {
		return {
			name: this.name,
			value: this.value,
			category: this.category,
			min: this.min,
			max: this.max,
		};
	}
}
