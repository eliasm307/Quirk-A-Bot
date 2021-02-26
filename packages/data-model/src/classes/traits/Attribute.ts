import { iNumberTraitWithCategoryProps } from './../../declarations/interfaces/trait-interfaces';
import { iBaseTraitProps, iTraitData, iNumberValue, iNumberTraitProps } from '../../declarations/interfaces/trait-interfaces';
import { AttributeName } from '../../declarations/types';
import { iAttributeData } from '../../declarations/interfaces/trait-interfaces';
import { AttributeCategory } from '../../declarations/types';
import BaseTrait from './BaseTrait';
import NumberTrait from './NumberTrait';
import NumberTraitWithCategory from './NumberTraitWithCategory';

export default class Attribute extends NumberTraitWithCategory<AttributeName, AttributeCategory> implements iAttributeData {
	readonly category: AttributeCategory;

	constructor(props: iNumberTraitWithCategoryProps<>) {
		super({ ...props, max: 5, min: 1 }); // todo define limits in add missing number trait props
		const { name } = props;
		this.category = this.getCategory(name);
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
