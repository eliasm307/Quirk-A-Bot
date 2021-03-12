import { iHasNewValue, iHasOldValue } from '../../declarations/interfaces';
import BaseLogEvent from './BaseLogEvent';
import { iLogEvent, iUpdateLogEventProps } from './interfaces/log-interfaces';

export default class UpdateLogEvent<T> extends BaseLogEvent<T> implements iLogEvent, iHasOldValue<T>, iHasNewValue<T> {
	newValue: T;
	oldValue: T;

	constructor({ description, oldValue, property, newValue }: iUpdateLogEventProps<T>) {
		super({ operation: 'UPDATE', property, description  });
		this.oldValue = oldValue;
		this.newValue = newValue;
	}

	describe(): string {
		return `${this.property} Updated from ${this.oldValue} to ${this.newValue}`;
	}
}
