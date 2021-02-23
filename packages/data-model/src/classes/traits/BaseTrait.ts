import { iBaseTraitProps } from './../../declarations/interfaces';
import { TraitName, TraitValue } from '../../declarations/types';
import { iCharacterSheet, iLogEvent, iLogger, iTrait } from '../../declarations/interfaces';
import LogCollection from '../log/LogCollection';

interface iPrivateModifiableProperties<T> {
	value: TraitValue<T>;
}

export default abstract class BaseTrait<T extends iTrait> implements iTrait, iLogger  {
	#private: iPrivateModifiableProperties<T>;
	// #characterSheet: iCharacterSheet;
	#logs = new LogCollection<TraitValue<T>>();
	#saveAction: () => boolean;

	readonly name: TraitName<T>;

	public set value(newVal: TraitValue<T>) {
		this.onChange('value', newVal);
	}
	public get value() {
		return this.#private.value as TraitValue<T>;
	}

	constructor ( { saveAction , name , value }: iBaseTraitProps<T>) {
		this.#saveAction = saveAction;
		this.name = name;
		this.#private = {
			value: value,
		};

		// todo, account for when this is instantiated independently, not by a CharacterSheet. Maybe use a factory? Or check for this when a change is made, ie before a save needs to be made (you could update the reference to the Skill based on which one was updated last? this seems like a bad pattern)
		// make sure character sheet has a reference to this Skill // will this produce any cyclic behaviour? tested, and YES it does
		// if (!this.#characterSheet.getSkillByName(name)) this.#characterSheet.setSkill(name, value);
	}
	getLogData(): iLogEvent [] {
		return this.#logs.toJson();
	}

	protected onChange<PrivateProperty extends keyof iPrivateModifiableProperties<T>>(
		property: PrivateProperty,
		newValue: TraitValue<T>
	): void {
		// get current value as old value
		const oldValue: TraitValue<T> = this.#private[property];

		// if old value is the same as new value do nothing
		if (oldValue === newValue)
			return console.log(__filename, `Trait "${property}" property was changed to the same value, nothing was done.`);

		// implement property change
		this.#private[property] = newValue;

		// todo record change, create a log class where this has an array of logs
		this.#logs;

		// attempt autosave
		this.#saveAction()
			? console.log(__filename, `Successfully saved trait property change`, { property, oldValue, newValue })
			: console.error(__filename, `Error while saving trait property change`, { property, oldValue, newValue });
	}
}
