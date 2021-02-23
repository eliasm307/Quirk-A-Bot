import { iBaseLogEventProps, iLogEvent, iOldValue } from '../../declarations/interfaces';
import BaseLogEvent from './BaseLogEvent';

interface iProps<T> extends iBaseLogEventProps, iOldValue<T> {}

export default class DeleteLogEvent<T> extends BaseLogEvent<T> implements iLogEvent<T>, iOldValue<T> {
	oldValue: T;

	constructor({ note: description, oldValue, property }: iProps<T>) {
		super({ operation: 'DELETE', property, note: description });
		this.oldValue = oldValue;
	}
	describe(): string {
		return `${this.property} deleted with last value of ${this.oldValue}`;
	}
}
