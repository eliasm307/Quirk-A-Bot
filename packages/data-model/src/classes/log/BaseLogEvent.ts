import { LogOperationUnion } from '../../declarations/types';
import { iBaseLogEventProps, iLogEvent } from '../../declarations/interfaces/log-interfaces';
import generateId from '../../utils/generateId';
import { getDateWithNanoSecondTimeStamp } from '../../utils/getNanoSecondTime';

// ? this doesnt seem right
interface iProps extends iBaseLogEventProps {
	operation: LogOperationUnion;
}

export default abstract class BaseLogEvent<T> implements iLogEvent {
	id: string;
	operation: LogOperationUnion;
	description?: string;
	property: string;
	timeStamp: bigint;
	date: Date;

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
	abstract describe(): string;
}
