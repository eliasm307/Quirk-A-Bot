import { AttributeName } from './../declarations/types'; 
import { testCs, testCsRandom } from '../utils/testUtils';
import TraitCollection from './TraitCollection';
import Attribute from './Attribute';

test('traitCollection CRUD tests', () => {
	const cs = testCsRandom;
	const tc = new TraitCollection<Attribute>(cs, (name, value) => new Attribute(cs, name, value));

	// test size method
	expect(tc.size).toEqual(0);

	// test adding new item
	tc.set('Wits', 3);
	expect(tc.has('Wits')).toBeTruthy();
	expect(tc.has('Dexterity')).toBeFalsy();
	expect(tc.size).toEqual(1);

	// test changing existing item value
	tc.set('Wits', 2);
	expect(tc.has('Wits')).toBeTruthy();
	expect(tc.has('Dexterity')).toBeFalsy();
	expect(tc.size).toEqual(1);

	// test deleting entry that doesnt exist
	tc.delete('Dexterity');
	expect(tc.size).toEqual(1);

	// test deleting existing entry
	tc.delete('Wits');
	expect(tc.size).toEqual(0);
});
