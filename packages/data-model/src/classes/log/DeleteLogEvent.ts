import { iBaseLogEventProps, iLogEvent, iOldValue } from '../../declarations/interfaces';
import BaseLogEvent from './BaseLogEvent';

interface iProps<T> extends iBaseLogEventProps, iOldValue<T> {}

export default class AddLogEvent<T> extends BaseLogEvent<T> implements iLogEvent<T>, iNewValue<T> {
	newValue: T;

	constructor({ description, newValue, property }: iProps<T>) {
		super({ operation: 'ADD', property, description });
		this.newValue = newValue;
	}
	describe(): string {
		return `${this.property} added with inital value of ${this.newValue}`;
	}
}
