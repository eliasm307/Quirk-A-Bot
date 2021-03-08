import {  } from '../../declarations/interfaces/trait-interfaces';
import { iHasOldValue } from '../../declarations/interfaces/general-interfaces';
import { iBaseLogEventProps, iDeleteLogEventProps, iLogEvent } from '../../declarations/interfaces/log-interfaces';
import BaseLogEvent from './BaseLogEvent';



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
