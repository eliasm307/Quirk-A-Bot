import { iLogCollection, iLogReport } from './../../declarations/interfaces/log-interfaces';
import { iLogEvent } from '../../declarations/interfaces/log-interfaces';
import { iBaseTrait } from '../../declarations/interfaces/trait-interfaces';
import { TraitNameUnionOrString, TraitValueTypeUnion } from '../../declarations/types';
import { iBaseTraitProps, iTraitData } from '../../declarations/interfaces/trait-interfaces';
import LogCollection from '../log/LogCollection';
import UpdateLogEvent from '../log/UpdateLogEvent';
import { iTraitDataStorage } from '../../declarations/interfaces/data-storage-interfaces';

export default abstract class AbstractBaseTrait<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>
> implements iBaseTrait<N, V, D> {
	// #private: iPrivateModifiableProperties<V>;
	// #characterSheet: iCharacterSheet;
	#dataSorage: iTraitDataStorage<N, V>;
	// todo logs should be #logs
	logs: iLogCollection;
	toJson: () => D;
	readonly name: N;

	protected abstract newValueIsValid(newVal: V): boolean;

	// protected abstract getDefaultValue(): V;

	constructor({ name, value, toJson,   traitDataStorageInitialiser }: iBaseTraitProps<N, V, D>) {
		this.name = name;

		// initialise data store
		this.#dataSorage = traitDataStorageInitialiser({ name, defaultValueIfNotDefined: value });

		if (!toJson) throw Error(`${__filename} toJson function not defined`);
		this.toJson = toJson;
		this.logs = new LogCollection({ sourceType: 'Trait', sourceName: this.name });

		// set initial value if specified
		if (value) this.value = value;
		/*
		this.#private = {
			value: this.preProcessValue(value),
		};*/

		// todo, account for when this is instantiated independently, not by a CharacterSheet. Maybe use a factory? Or check for this when a change is made, ie before a save needs to be made (you could update the reference to the Skill based on which one was updated last? this seems like a bad pattern)
		// make sure character sheet has a reference to this Skill // will this produce any cyclic behaviour? tested, and YES it does
		// if (!this.#characterSheet.getSkillByName(name)) this.#characterSheet.setSkill(name, value);
	}

	public set value(newValRaw: V) {
		const newValue = this.preProcessValue( newValRaw );
		
		// justification should be done in newValueIsValid function
		if (!this.newValueIsValid(newValue)) return;

		// get current value as old value
		const oldValue: V = this.#dataSorage.value;

		// if old value is the same as new value do nothing
		if (oldValue === newValue) {
			// console.log(__filename, `Trait value was changed to the same value, nothing was done.`);
			return;
		}

		// implement property change
		this.#dataSorage.value = newValue;

		if (!this.logs) {
			console.error(__filename, `this.#logs is not defined`);
		}

		// log change
		this.logs.log(new UpdateLogEvent({ newValue, oldValue, property: this.name }));
	}
	public get value() {
		return this.#dataSorage.value;
	}

	getLogEvents(): iLogEvent[] {
		return this.getLogReport().logEvents;
	}

	getLogReport(): iLogReport {
		return this.logs.getReport();
	}

	protected abstract preProcessValue(newValueRaw: V): V;
}
