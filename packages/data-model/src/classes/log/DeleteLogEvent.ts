import {  } from '../../declarations/interfaces/trait-interfaces';
import { iOldValue } from '../../declarations/interfaces/general-interfaces';
import { iBaseLogEventProps, iLogEvent } from '../../declarations/interfaces/log-interfaces';
import BaseLogEvent from './BaseLogEvent';

interface iProps<T> extends iBaseLogEventProps, iOldValue<T> {}

export default class DeleteLogEvent<T> extends BaseLogEvent<T> implements iLogEvent, iOldValue<T> {
	oldValue: T;

	constructor({ note, oldValue, property }: iProps<T>) {
		super({ operation: 'DELETE', property, note });
		this.oldValue = oldValue;
	}
	describe(): string {
		return `${this.property} deleted with last value of ${this.oldValue}`;
	}
}
