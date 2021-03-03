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
	note?: string;
	property: string;
	time: Date;

	constructor({ operation, note: description, property }: iProps) {
		// check values are defined correctly
		// todo delete this
		/*
		switch (operation) {
			case 'ADD':
				if (!newValue) throw Error(`${operation} operation requires a newValue to be defined`);
				if (oldValue)
					console.warn(__filename, `${operation} operation doesnt require an old value, this will be ignored`);
				break;

			case 'DELETE':
				if (!oldValue) throw Error(`${operation} operation requires a oldValue to be defined`);
				if (newValue)
					console.warn(__filename, `${operation} operation doesnt require a new value, this will be ignored`);
				break;

			case 'UPDATE':
				if (!oldValue && !newValue)
					throw Error(`${operation} operation requires both an initalValue and a newValue to be defined`);
				break;

			default:
				throw Error(`Unknown operation "${operation}"`);
		}
*/
		this.id = generateId();
		this.operation = operation;
		this.note = description;
		this.property = property;
		this.time = new Date();
	}
	abstract describe(): string;
}
