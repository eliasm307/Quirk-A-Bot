import { iAttribute } from '../../declarations/interfaces/trait-interfaces';
import CharacterSheet from '../CharacterSheet';
import TraitCollection from './TraitCollection';
import TraitFactory from './TraitFactory';

const cs: CharacterSheet = new CharacterSheet(0, '../data/character-sheets/temporary/test.json');

// todo, make this a test for BaseTrait

let testName = 'test adding attribute directly to Character sheet';

test(testName, () => {
	const tc = new TraitCollection<iAttribute>({
		instanceCreator: (name, value) => TraitFactory.newAttributeTrait({ name, value }),
	});
	cs.attributes.set('Charisma', 3);

	console.log(__filename, { testName, attributes: cs.attributes.toJson() });

	expect(cs.attributes.size).toBeGreaterThan(0);
	expect(cs.attributes.toJson().map(a => a.name)).toContain('Charisma');
	expect(cs.attributes.getLogData().length).toBeGreaterThanOrEqual(1);
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
