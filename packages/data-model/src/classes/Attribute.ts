import { AttributeName } from './../declarations/types';
import { iAttribute, iCharacterSheet } from '../declarations/interfaces';
import { AttributeCategory } from '../declarations/types';
import CharacterSheet from './CharacterSheet';

interface iPrivateModifiableProperties {
	value: number;
}

// todo make a base trait class that implements iTrait, which is implemented by Skills, Attributes etc

export default class Attribute implements iAttribute {
	#private: iPrivateModifiableProperties;
	#characterSheet: iCharacterSheet;

	readonly category: AttributeCategory;
	readonly name: AttributeName;

	public set value(newVal: number) {
		this.onChange('value', newVal);
	}
	public get value() {
		return this.#private.value;
	}
 
	constructor(characterSheet: iCharacterSheet, name: AttributeName, value: number = 0) {
		this.#characterSheet = characterSheet;
		this.name = name;
		this.category = this.getCategory(name);
		this.#private = {
			value: value,
		};

		// todo, account for when this is instantiated independently, not by a CharacterSheet. Maybe use a factory? Or check for this when a change is made, ie before a save needs to be made (you could update the reference to the attribute based on which one was updated last? this seems like a bad pattern)
		// make sure character sheet has a reference to this attribute // ? will this produce any cyclic behaviour? tested, and YES it does
		// if (!this.#characterSheet.getAttributeByName(name)) this.#characterSheet.setAttribute(name, value);
	}

	private getCategory(name: AttributeName): AttributeCategory {
		switch (name) {
			case 'Strength':
			case 'Dexterity':
			case 'Stamina':
				return 'Physical';
			case 'Charisma':
			case 'Manipulation':
			case 'Composure':
				return 'Social';
			case 'Intelligence':
			case 'Wits':
			case 'Resolve':
				return 'Mental';
			default:
				throw `${__filename} ERROR: Unknown attribute name "${name}"`;
		}
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
