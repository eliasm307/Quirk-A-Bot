import { iDeleteLogEventProps, iHasOldValue, iLogEvent } from '../interfaces/log-interfaces';
import BaseLogEvent from './BaseLogEvent';

export default class DeleteLogEvent<T> extends BaseLogEvent implements iLogEvent, iHasOldValue<T> {
	oldValue: T;

	constructor({ oldValue, ...restProps }: iDeleteLogEventProps<T>) {
		super({ ...restProps, operation: 'DELETE' });
		this.oldValue = oldValue;
	}

	describe(): string {
		return `${this.property} deleted with last value of ${this.oldValue}`;
	}
}
