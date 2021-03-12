import { iBaseLogEventProps, iLogEvent } from '../../declarations/interfaces/log-interfaces';
import { LogOperationUnion } from '../../declarations/types';
import generateId from '../../utils/generateId';
import { getDateWithNanoSecondTimeStamp } from '../../utils/getNanoSecondTime';

// ? this doesnt seem right
interface iProps extends iBaseLogEventProps {
	operation: LogOperationUnion;
}

// todo use strategy pattern for description function

export default abstract class BaseLogEvent<T> implements iLogEvent {
	public date: Date;
	description?: string;
	public id: string;
	public operation: LogOperationUnion;
	public property: string;
	public timeStamp: bigint;

	public abstract describe(): string;

	constructor({ operation, description, property }: iProps) {
		this.id = generateId();
		this.operation = operation;
		this.description = this.describe(); // todo description function should be a property for the abstract, so it can be used here initially
		this.property = property;

		// generate time stamp and save date object
		const [date, nanoSecondTimeStamp] = getDateWithNanoSecondTimeStamp();
		this.date = date;
		this.timeStamp = nanoSecondTimeStamp;
	}
}
