import { iHasOldValue, iHasNewValue } from '../../declarations/interfaces/general-interfaces';
import { iBaseLogEventProps, iLogEvent } from '../../declarations/interfaces/log-interfaces';
import BaseLogEvent from './BaseLogEvent';

interface iProps<T> extends iBaseLogEventProps, iHasOldValue<T>, iHasNewValue<T> {}

export default class UpdateLogEvent<T> extends BaseLogEvent<T> implements iLogEvent, iHasOldValue<T>, iHasNewValue<T> {
	oldValue: T;
	newValue: T;

	constructor({ description, oldValue, property, newValue }: iProps<T>) {
		super({ operation: 'UPDATE', property, description });
		this.oldValue = oldValue;
		this.newValue = newValue;
	}

	describe(): string {
		return `${this.property} Updated from ${this.oldValue} to ${this.newValue}`;
	}
}
