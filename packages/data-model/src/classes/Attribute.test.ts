import { iAttribute } from '../declarations/interfaces';
import Attribute from './Attribute';
import CharacterSheet from './CharacterSheet';

const cs: CharacterSheet = new CharacterSheet(0, '../data/character-sheets/temporary/test.json');

let testName = 'test adding attribute directly to Character sheet';
test(testName, () => {
	cs.setAttribute('Charisma', 3);

	console.log(__filename, { testName, attributes: cs.attributes });

	expect(cs.attributes.length).toBeGreaterThan(0);
	expect(cs.attributes.map(a => a.name)).toContain('Charisma');
});

/*
testName = 'adding attribute indirectly by instantiating attribute';
test(testName, () => {
	const attribute: iAttribute = new Attribute(cs, 'Composure', 3);

	console.log(__filename, { testName, attributes: cs.attributes });

	expect(true).toEqual(true);
	// expect(cs.attributes.length).toBeGreaterThan(0);
	// expect(cs.attributes.map(a => a.name)).toContain('Composure');
});*/
