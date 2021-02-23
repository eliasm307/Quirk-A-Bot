import { iAttributeData, iBaseTraitProps } from './../../declarations/interfaces';
 
import {  iDisciplineData  } from '../../declarations/interfaces';
import AbstractNumberTrait from './AbstractNumberTrait';
import BaseTrait from './BaseTrait';
export default class Discipline extends AbstractNumberTrait<iDisciplineData> implements iDisciplineData {
	constructor(props: iBaseTraitProps<iDisciplineData>) {
		super({ ...props, max: 5, min: 1 });
		const { name } = props; 
	}
}
