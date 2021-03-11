import { iHasNewValue, iHasOldValue } from '../../declarations/interfaces/general-interfaces';
import { iLogEvent, iUpdateLogEventProps } from '../../declarations/interfaces/log-interfaces';
import BaseLogEvent from './BaseLogEvent';

export default class UpdateLogEvent<T> extends BaseLogEvent<T> implements iLogEvent, iHasOldValue<T>, iHasNewValue<T> {
	oldValue: T;
	newValue: T;

	constructor({ description, oldValue, property, newValue }: iUpdateLogEventProps<T>) {
		super({ operation: 'UPDATE', property, description });
		this.oldValue = oldValue;
		this.newValue = newValue;
	}

	describe(): string {
		return `${this.property} Updated from ${this.oldValue} to ${this.newValue}`;
	}
}
