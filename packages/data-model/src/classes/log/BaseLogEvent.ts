import { iBaseLogEventProps } from './../../declarations/interfaces';
import { LogOperation, LogInitialValue, LogNewValue } from '../../declarations/types';
import { iLogEvent } from '../../declarations/interfaces';

// ? this doesnt seem right
interface iProps extends iBaseLogEventProps {
	operation: LogOperation;
}

export default abstract class BaseLogEvent<T> implements iLogEvent<T> {
	operation: LogOperation;
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
		this.operation = operation;
		this.note = description;
		this.property = property;
		this.time = new Date();
	}
	abstract describe(): string;
}
