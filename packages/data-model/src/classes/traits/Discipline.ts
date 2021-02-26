import { iAttributeData, iBaseTraitProps } from '../../declarations/interfaces/trait-interfaces';
 
import {  iDisciplineData  } from '../../declarations/interfaces/trait-interfaces';
import NumberTrait from './NumberTrait';
import AbstractBaseTrait from './AbstractBaseTrait';
export default class Discipline extends NumberTrait<iDisciplineData> implements iDisciplineData {
	constructor(props: iBaseTraitProps<iDisciplineData>) {
		super({ ...props, max: 5, min: 1 });
		const { name } = props; 
	}
}
