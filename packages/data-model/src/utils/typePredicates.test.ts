import { iGeneralTraitData } from './../declarations/interfaces/trait-interfaces';
import { isTraitData } from './typePredicates';

test('Trait data predicate', () => {
	const numberTraitData: iGeneralTraitData = {
		name: 'name',
		value: Number.MAX_SAFE_INTEGER,
	};

	const stringTraitData: iGeneralTraitData = {
		name: 'name',
		value: 'value',
	};

	const notTraitData = {
		name: 'name',
	};

	expect(isTraitData(numberTraitData)).toBeTruthy();
	expect(isTraitData(stringTraitData)).toBeTruthy();
	expect(isTraitData(notTraitData)).toBeFalsy();
	expect(isTraitData(1)).toBeFalsy();
});
