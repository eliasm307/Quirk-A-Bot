import { LogOperation } from '../../declarations/types';
import { iLogCollection, iLogEvent } from './../../declarations/interfaces';
export default class LogCollection<T> implements iLogCollection<T> {
	#logs: iLogEvent<T, LogOperation>[] = [];

	constructor() {}
	log(event: iLogEvent<T, LogOperation>): void {
		this.#logs.push(event);
	}
	toJson(): iLogEvent<T, LogOperation>[] {
		return [...this.#logs];
	}
}
