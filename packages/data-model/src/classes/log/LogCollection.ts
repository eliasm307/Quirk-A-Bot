import { LogOperation } from '../../declarations/types';
import { iLogCollection, iLogEvent } from './../../declarations/interfaces';
export default class LogCollection<T> implements iLogCollection<T> {
	#logs: iLogEvent<T>[] = [];

	constructor() {}
	log(event: iLogEvent<T>): void {
		this.#logs.push(event);
	}
	toJson(): iLogEvent<T>[] {
		return [...this.#logs];
	}
}
