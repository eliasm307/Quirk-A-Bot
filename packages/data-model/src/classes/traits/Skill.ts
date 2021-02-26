import { iAttributeData, iBaseTraitProps, iSkillData, iTraitData } from '../../declarations/interfaces';
import AbstractNumberTrait from './NumberTrait';
import BaseTrait from './BaseTrait';

interface iProps<T extends iTraitData> extends iBaseTraitProps<T> { }

export default class Skill extends AbstractNumberTrait<iSkillData> implements iSkillData {
	constructor(props: iProps<iSkillData>) {
		super({ ...props, max: 5, min: 0 });
		const { name } = props;
	}
}
