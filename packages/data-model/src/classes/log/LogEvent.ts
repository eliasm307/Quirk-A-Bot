import { LogOperation, LogInitialValue, LogNewValue } from './../../declarations/types';
import { iLogEvent } from './../../declarations/interfaces';

interface Props<T, L extends LogOperation> {
	operation: LogOperation;
	description?: string;
	oldValue?: T;
	newValue?: T;
	property: string;
}
interface PropsOLD<T, L extends LogOperation> {
	operation: L;
	description?: string;
	oldValue: LogInitialValue<T, L>;
	newValue: LogNewValue<T, L>;
}
interface deleteProps<T> {
	operation: LogOperation;
	description?: string;
	oldValue: LogInitialValue<T, LogOperation>;
}
interface updateProps<T> {
	operation: LogOperation;
	description?: string;
	oldValue: LogInitialValue<T, LogOperation>;
	newValue: LogNewValue<T, LogOperation>;
}
interface addProps<T> {
	operation: LogOperation;
	description?: string;
	newValue: LogNewValue<T, LogOperation>;
}

type props<T, L extends LogOperation> = L extends 'DELETE'
	? deleteProps<T>
	: L extends 'ADD'
	? addProps<T>
	: updateProps<T>;

// todo try applying conditional types for the initial and new values based on operation type here
export default class LogEvent<T, L extends LogOperation> implements iLogEvent<T> {
	operation: LogOperation;
	description?: string;
	initialValue?: T;
	newValue?: T;
	property: string;

	constructor({ operation, description, oldValue, newValue, property }: Props<T, L>) {
		// check values are defined correctly
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

		this.operation = operation;
		this.description = description;
		this.initialValue = oldValue;
		this.newValue = newValue;
		this.property = property;
	}
}
