import { LogOperationUnion } from '../../declarations/types';
import { iBaseLogEventProps, iLogEvent } from '../../declarations/interfaces/log-interfaces';
import generateId from '../../utils/generateId';

// ? this doesnt seem right
interface iProps extends iBaseLogEventProps {
	operation: LogOperationUnion;
}

export default abstract class BaseLogEvent<T> implements iLogEvent {
	id: string;
	operation: LogOperationUnion;
	description?: string;
	property: string;
	time: Date;

	constructor({ operation, description, property }: iProps) {
		this.id = generateId();
		this.operation = operation;
		this.description = description;
		this.property = property;
		this.time = new Date();
	}
	abstract describe(): string;
}
