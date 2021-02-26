import {
	iAttributeData,
	iBaseTraitProps,
	iSkillData,
	iTraitData,
} from '../../declarations/interfaces/trait-interfaces';
import NumberTrait from './NumberTrait';
import BaseTrait from './BaseTrait';

interface iProps<N extends TraitNameUnion> extends iBaseTraitProps<T> {}

export default class Skill extends NumberTrait<iSkillData> implements iSkillData {
  constructor ( props: iProps<iSkillData> ) {
    // todo customise this in Factory?
		super({ ...props, max: 5, min: 0 });
		const { name } = props;
	}
}
