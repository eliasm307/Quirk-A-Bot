import { SkillName } from '../declarations/types';
import { iSkill } from '../declarations/interfaces'; 
import CharacterSheet from './CharacterSheet';

interface iPrivateModifiableProperties {
	value: number;
}

export default class Skill implements iSkill {
	#private: iPrivateModifiableProperties;
	#characterSheet: CharacterSheet;
 
	readonly name: SkillName;

	public set value(newVal: number) {
		this.onChange('value', newVal);
	}
	public get value() {
		return this.#private.value;
	}

	// todo dont use CharacterSheet class as dependency
	constructor(characterSheet: CharacterSheet, name: SkillName, value: number = 0) {
		this.#characterSheet = characterSheet;
		this.name = name; 
		this.#private = {
			value: value,
		};

		// todo, account for when this is instantiated independently, not by a CharacterSheet. Maybe use a factory? Or check for this when a change is made, ie before a save needs to be made (you could update the reference to the Skill based on which one was updated last? this seems like a bad pattern)
		// make sure character sheet has a reference to this Skill // ? will this produce any cyclic behaviour? tested, and YES it does
		// if (!this.#characterSheet.getSkillByName(name)) this.#characterSheet.setSkill(name, value);
	}
 

	private onChange<PrivateProperty extends keyof iPrivateModifiableProperties>(
		property: PrivateProperty,
		newValue: any
	): void {
		// get current value as old value
		const oldValue: any = this.#private[property];

		// if old value is the same as new value do nothing
		if (oldValue === newValue)
			return console.log(__filename, `Property ${property} was changed to the same value, nothing was done.`);

		// implement property change
		this.#private[property] = newValue;

		// todo record change, create a log class where this has an array of logs

		// attempt autosave
		this.#characterSheet.saveToFile()
			? console.log(__filename, `Successfully saved change`, { property, oldValue, newValue })
			: console.error(__filename, `Error while saving change`, { property, oldValue, newValue });
	}
}
