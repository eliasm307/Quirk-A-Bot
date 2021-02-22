import { AttributeName } from './../declarations/types';
import { iAttribute, iCharacterSheet } from '../declarations/interfaces';
import { AttributeCategory } from '../declarations/types';
import CharacterSheet from './CharacterSheet';
import BaseTrait from './BaseTrait';

interface iPrivateModifiableProperties {
	value: number;
}

// todo make a base trait class that implements iTrait, which is implemented by Skills, Attributes etc

export default class Attribute extends BaseTrait<iAttribute> implements iAttribute {
	readonly category: AttributeCategory;

	constructor(characterSheet: iCharacterSheet, name: AttributeName, value: number = 0) {
		super(characterSheet, name, value);
		this.category = this.getCategory(name);
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
	/*
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
	}*/
}
