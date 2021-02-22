import { LogInitialValue, LogNewValue, LogOperation } from '../../declarations/types';
import { iLogCollection, iLogEvent } from './../../declarations/interfaces';

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
export default class LogCollection<T> implements iLogCollection<T> {
	#logs: iLogEvent<T>[] = [];

	constructor() {}
  logAdd( event: addProps<T> ): void {
    throw new Error( 'Method not implemented.' );
  }
  logUpdate( event: iLogEvent<T> ): void {
    throw new Error( 'Method not implemented.' );
  }
  logDelete( event: iLogEvent<T> ): void {
    throw new Error( 'Method not implemented.' );
  }
	log(event: iLogEvent<T>): void {
		this.#logs.push(event);
	}
	toJson(): iLogEvent<T>[] {
		return [...this.#logs];
	}
}
