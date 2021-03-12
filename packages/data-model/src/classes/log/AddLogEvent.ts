import { iAddLogEvent, iAddLogEventProps } from '../../declarations/interfaces/log-interfaces';
import BaseLogEvent from './BaseLogEvent';

export default class AddLogEvent<T> extends BaseLogEvent<T> implements iAddLogEvent<T> {
	public newValue: T;

	constructor({ description, newValue, property }: iAddLogEventProps<T>) {
		super({ operation: 'ADD', property, description });
		this.newValue = newValue;
	}

	public describe(): string {
		return `${this.property} added with inital value of ${this.newValue}`;
	}
}
