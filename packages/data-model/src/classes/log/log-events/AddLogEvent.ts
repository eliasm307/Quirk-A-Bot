import { iAddLogEvent, iAddLogEventProps } from '../interfaces/log-interfaces';
import BaseLogEvent from './BaseLogEvent';

export default class AddLogEvent<T> extends BaseLogEvent  implements iAddLogEvent<T> {
	public newValue: T;

	constructor({ newValue, ...restProps }: iAddLogEventProps<T>) {
		super({ ...restProps, operation: 'ADD' });
		this.newValue = newValue;
	}

	public describe(): string {
		return `${this.property} added with inital value of ${this.newValue}`;
	}
}
