import { iHasNewValue } from '../../declarations/interfaces/general-interfaces';
import { iBaseLogEventProps, iAddLogEvent } from '../../declarations/interfaces/log-interfaces';
import BaseLogEvent from './BaseLogEvent';

interface iProps<T> extends iBaseLogEventProps, iHasNewValue<T> {}

export default class AddLogEvent<T> extends BaseLogEvent<T> implements iAddLogEvent<T> {
	newValue: T;
	constructor({ description, newValue, property }: iProps<T>) {
		super({ operation: 'ADD', property, description });
		this.newValue = newValue;
	}
	describe(): string {
		return `${this.property} added with inital value of ${this.newValue}`;
	}
}
