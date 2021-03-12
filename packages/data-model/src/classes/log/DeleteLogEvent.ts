 
import BaseLogEvent from './BaseLogEvent';
import { iDeleteLogEventProps, iHasOldValue, iLogEvent } from './interfaces/log-interfaces';

export default class DeleteLogEvent<T> extends BaseLogEvent<T> implements iLogEvent, iHasOldValue<T> {
	oldValue: T;

	constructor({ description: note, oldValue, property }: iDeleteLogEventProps<T>) {
		super({ operation: 'DELETE', property, description: note });
		this.oldValue = oldValue;
	}
	describe(): string {
		return `${this.property} deleted with last value of ${this.oldValue}`;
	}
}
