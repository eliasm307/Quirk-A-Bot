import { iGeneralTraitData } from '../../classes/traits/interfaces/trait-interfaces';
import isTraitData from './isTraitData';

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

	const notTraitData2 = {
		...stringTraitData,
		groove: 'yes',
	};

	expect(isTraitData(numberTraitData)).toBeTruthy();
	expect(isTraitData(stringTraitData)).toBeTruthy();
	expect(isTraitData(notTraitData)).toBeFalsy();
	expect(isTraitData(notTraitData2)).toBeFalsy();
	expect(isTraitData(1)).toBeFalsy();
});
