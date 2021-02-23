import { iBaseLogEventProps, iLogEvent, iNewValue, iOldValue } from '../../declarations/interfaces';
import BaseLogEvent from './BaseLogEvent';

interface iProps<T> extends iBaseLogEventProps, iOldValue<T>, iNewValue<T> {}

export default class UpdateLogEvent<T> extends BaseLogEvent<T> implements iLogEvent, iOldValue<T>, iNewValue<T> {
	oldValue: T;
	newValue: T;

	constructor({ note: description, oldValue, property, newValue }: iProps<T>) {
		super({ operation: 'UPDATE', property, note: description });
		this.oldValue = oldValue;
		this.newValue = newValue;
	}

	describe(): string {
		return `${this.property} Updated from ${this.oldValue} to ${this.newValue}`;
	}
}
