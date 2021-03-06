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
	#logs: iLogCollection;
	#saveAction?: () => boolean;

	readonly name: N;

	protected abstract newValueIsValid(newVal: V): boolean;

	public set value(newValRaw: V) {
		const newValue = this.preProcessValue(newValRaw);
		if (!this.newValueIsValid(newValue)) {
			console.error(__filename, `${this.name} cannot be set to ${newValue}`);
			return;
		}

		// get current value as old value
		const oldValue: V = this.#dataSorage.value;

		// if old value is the same as new value do nothing
		if (oldValue === newValue) {
			console.log(__filename, `Trait value was changed to the same value, nothing was done.`);
			return;
		}

		// implement property change
		this.#dataSorage.value = newValue;

		// log change
		this.#logs.log(new UpdateLogEvent({ newValue, oldValue, property: this.name }));

		// attempt autosave, if available
		if (this.#saveAction) {
			this.#saveAction()
				? console.log(__filename, `Successfully saved trait property change`, { oldValue, newValue })
				: console.error(__filename, `Error while saving trait property change`, { oldValue, newValue });
		}
 
	}
	public get value() {
		return this.#dataSorage.value;
	}

	constructor({ saveAction, name, value, toJson }: iBaseTraitProps<N, V, D>) {
		this.#saveAction = saveAction;
		this.name = name;

		// initialise data store

		// set initial value if specified
		if (value) this.value = value;
		/*
		this.#private = {
			value: this.preProcessValue(value),
		};*/
		if (!toJson) throw Error(`${__filename} toJson function not defined`);
		this.toJson = toJson;
		this.#logs = new LogCollection({ sourceType: 'Trait', sourceName: this.name });

		// todo, account for when this is instantiated independently, not by a CharacterSheet. Maybe use a factory? Or check for this when a change is made, ie before a save needs to be made (you could update the reference to the Skill based on which one was updated last? this seems like a bad pattern)
		// make sure character sheet has a reference to this Skill // will this produce any cyclic behaviour? tested, and YES it does
		// if (!this.#characterSheet.getSkillByName(name)) this.#characterSheet.setSkill(name, value);
	}
	getLogEvents(): iLogEvent[] {
		return this.getLogReport().logEvents;
	}
	toJson: () => D;

	getLogReport(): iLogReport {
		return this.#logs.getReport();
	}

	protected abstract preProcessValue(newValueRaw: V): V;
}
