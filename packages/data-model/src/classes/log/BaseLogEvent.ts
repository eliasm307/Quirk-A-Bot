import { iBaseLogEventProps, iLogEvent } from '../../declarations/interfaces/log-interfaces';
import { LogOperationUnion } from '../../declarations/types';
import generateId from '../../utils/generateId';
import { getDateWithNanoSecondTimeStamp } from '../../utils/getNanoSecondTime';

// ? this doesnt seem right
interface iProps extends iBaseLogEventProps {
	operation: LogOperationUnion;
}

export default abstract class BaseLogEvent<T> implements iLogEvent {
	public date: Date;
	description?: string;
	public id: string;
	public operation: LogOperationUnion;
	public property: string;
	public timeStamp: bigint;

	constructor({ operation, description, property }: iProps) {
		this.id = generateId();
		this.operation = operation;
		this.description = description; // todo description function should be a property for the abstract, so it can be used here initially
		this.property = property;

		// generate time stamp and save date object
		const [date, nanoSecondTimeStamp] = getDateWithNanoSecondTimeStamp();
		this.date = date;
		this.timeStamp = nanoSecondTimeStamp;
	}

	public abstract describe(): string;
}
