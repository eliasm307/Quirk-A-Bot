import { iLogCollection, iLogReport } from './../../declarations/interfaces/log-interfaces';
import { iLogEvent } from '../../declarations/interfaces/log-interfaces';
import { iBaseTrait } from '../../declarations/interfaces/trait-interfaces';
import {
	TraitNameUnion,
	TraitNameUnionOrString,
	TraitValueTypeUnion,
	TraitValueDynamic,
} from '../../declarations/types';
import { iBaseTraitProps, iTraitData } from '../../declarations/interfaces/trait-interfaces';
import LogCollection from '../log/LogCollection';
import UpdateLogEvent from '../log/UpdateLogEvent';

interface iPrivateModifiableProperties<V> {
	value: V;
}

export default abstract class AbstractBaseTrait<
	N extends TraitNameUnionOrString,
	V extends TraitValueTypeUnion,
	D extends iTraitData<N, V>
> implements iBaseTrait<N, V, D> {
	#private: iPrivateModifiableProperties<V>;
	// #characterSheet: iCharacterSheet;

	// todo log collections should not rely on iTraitData
	#logs: iLogCollection;
	#saveAction?: () => boolean;

	readonly name: N;

	protected abstract newValueIsValid(newVal: V): boolean;

	public set value(newVal: V) {
		if (this.newValueIsValid(newVal)) this.onChange('value', newVal);
	}
	public get value() {
		return this.#private.value;
	}

	constructor({ saveAction, name, value, toJson }: iBaseTraitProps<N, V, D>) {
		this.#saveAction = saveAction;
		this.name = name;
		this.#private = {
			value: value,
		};
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

	protected onChange<PrivateProperty extends keyof iPrivateModifiableProperties<V>>(
		property: PrivateProperty,
		newValue: V
	): void {
		// get current value as old value
		const oldValue: V = this.#private[property];

		// if old value is the same as new value do nothing
		if (oldValue === newValue)
			return console.log(__filename, `Trait "${property}" property was changed to the same value, nothing was done.`);

		// implement property change
		this.#private[property] = newValue;

		// log change
		this.#logs.log(new UpdateLogEvent({ newValue, oldValue, property: this.name }));

		// attempt autosave, if available
		if (this.#saveAction) {
			this.#saveAction()
				? console.log(__filename, `Successfully saved trait property change`, { property, oldValue, newValue })
				: console.error(__filename, `Error while saving trait property change`, { property, oldValue, newValue });
		}
	}
}
