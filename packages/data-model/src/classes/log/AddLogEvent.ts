import { iHasNewValue } from '../../declarations/interfaces/general-interfaces';
import { iBaseLogEventProps, iAddLogEvent, iAddLogEventProps } from '../../declarations/interfaces/log-interfaces';
import CharacterSheet from '../CharacterSheet';
import BaseLogEvent from './BaseLogEvent';



export default class AddLogEvent<T> extends BaseLogEvent<T> implements iAddLogEvent<T> {
	newValue: T;
	constructor({ description, newValue, property }: iAddLogEventProps<T>) {
		super({ operation: 'ADD', property, description });
		this.newValue = newValue;
	}
	describe(): string {
		return `${this.property} added with inital value of ${this.newValue}`;
	
	}

	
}
