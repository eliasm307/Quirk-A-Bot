import { LogOperationUnion } from '../../declarations/types';
import generateId from '../../utils/generateId';
import {
  iAddLogEvent, iAddLogEventProps, iBaseLogEventConstructorProps, iLogEvent
} from './interfaces/log-interfaces';
import addEventDescriber from './utils/event-describers/addEventDescriber';
import { getDateWithNanoSecondTimeStamp } from './utils/getNanoSecondTime';

// ? this doesnt seem right, why does this need to extend props made for itself?
/*interface iProps extends iBaseLogEventProps {
	operation: LogOperationUnion;
}*/

// todo use strategy pattern for description function

export default class BaseLogEvent<V> implements iLogEvent<V> {
	public date: Date;
	description: string;
	public id: string;
	newValue: V;
	oldValue: V;
	public operation: LogOperationUnion;
	public property: string;
	public timeStamp: bigint;

	public abstract describe(): string;

	private constructor(props: iBaseLogEventConstructorProps<V>) {
		const { operation, property, describer, newValue, oldValue } = props;
		this.id = generateId();

		this.operation = operation;
		this.property = property;
		this.newValue = newValue;
		this.oldValue = oldValue;

		this.description = describer(props);

		// generate time stamp and save date object
		const [date, nanoSecondTimeStamp] = getDateWithNanoSecondTimeStamp();
		this.date = date;
		this.timeStamp = nanoSecondTimeStamp;
	}

	static newAddEvent<V>(props: iAddLogEventProps<V>): iAddLogEvent<V> {
		return new BaseLogEvent({ ...props, operation: 'ADD', describer: addEventDescriber, oldValue: nul });
	}
}
