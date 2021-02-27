import { iHasNewValue } from '../../declarations/interfaces/general-interfaces';
import { iBaseLogEventProps, iAddLogEvent } from '../../declarations/interfaces/log-interfaces';
import BaseLogEvent from './BaseLogEvent';

interface iProps<T> extends iBaseLogEventProps, iHasNewValue<T> {}

// ? do these need to implement iNewValue? whenthese are put into a collection, the additional iNewValue, iOldValue etc details are lost so is there a point? the differences shouldjust be on the specific classes and they all extend iBaseLogEvent? Actually properties can still be accessed using instanceof checks?
export default class AddLogEvent<T> extends BaseLogEvent<T> implements iAddLogEvent<T> {
	newValue: T;

	constructor({ note: description, newValue, property }: iProps<T>) {
		super({ operation: 'ADD', property, note: description });
		this.newValue = newValue;
	}
	describe(): string {
		return `${this.property} added with inital value of ${this.newValue}`;
	}
}
