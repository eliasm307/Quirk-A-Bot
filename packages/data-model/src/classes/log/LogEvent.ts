import { LogOperation, LogInitialValue } from './../../declarations/types';
import { iLogEvent } from './../../declarations/interfaces';

interface props<T, L extends LogOperation> {
	operation: L;
	description: string;
	oldValue: LogInitialValue<T, L>;
	newValue?: T;
}

// todo try applying conditional types for the initial and new values based on operation type here
export default class LogEvent<T, L extends LogOperation> implements iLogEvent<T> {
	operation: L;
	description: string;
	initialValue: LogInitialValue<T, L>;
	newValue?: T;

	constructor({ operation, description, oldValue: initialValue, newValue }: props<T, L>) {
		// check values are defined correctly
		switch (operation) {
			case 'ADD':
				if (!newValue) throw `${operation} operation requires a newValue to be defined`;
				if (initialValue)
					console.warn(__filename, `${operation} operation doesnt require an initial value, this will be ignored`);
				break;

			case 'DELETE':
				if (!initialValue) throw `${operation} operation requires a newValue to be defined`;
				if (newValue)
					console.warn(__filename, `${operation} operation doesnt require a new value, this will be ignored`);
				break;

			case 'UPDATE':
				if (!initialValue && !newValue)
					throw `${operation} operation requires both an initalValue and a newValue to be defined`;
				break;

			default:
				throw `Unknown operation "${operation}"`;
		}

		this.operation = operation;
		this.description = description;
		this.initialValue = initialValue;
		this.newValue = newValue;
	}
}
