import { iBaseTraitProps, iTraitData } from './../../declarations/interfaces';
import { AttributeName } from '../../declarations/types';
import { iAttributeData, iCharacterSheet } from '../../declarations/interfaces';
import { AttributeCategory } from '../../declarations/types';
import BaseTrait from './BaseTrait';

interface iProps<T extends iTraitData> extends   iBaseTraitProps<T> {}

export default class Attribute extends BaseTrait<iAttributeData> implements iAttributeData {
	readonly category: AttributeCategory;

	constructor ( props: iProps<iAttributeData> ) {
		super( props );
		this.category = this.getCategory( props.name );
	}

	private getCategory( name: AttributeName ): AttributeCategory {
		switch ( name ) {
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
				throw Error( `${ __filename } ERROR: Unknown attribute name "${ name }"` );
		}
	}
	toJson(): iAttributeData {
		return {
			name: this.name,
			value: this.value,
			category: this.category
		};
	}
}