import {
  iHasNewValue, iHasOldValue, iLogEvent, iUpdateLogEventProps
} from '../interfaces/log-interfaces';
import BaseLogEvent from './BaseLogEvent';

export default class UpdateLogEvent<T> extends BaseLogEvent  implements iLogEvent, iHasOldValue<T>, iHasNewValue<T> {
	newValue: T;
	oldValue: T;

	constructor({ oldValue, newValue, ...restProps }: iUpdateLogEventProps<T>) {
		super({ ...restProps, operation: 'UPDATE' });
		this.oldValue = oldValue;
		this.newValue = newValue;
	}

	describe(): string {
		return `${this.property} Updated from ${this.oldValue} to ${this.newValue}`;
	}
}
