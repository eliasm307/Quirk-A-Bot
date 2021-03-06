import NumberTrait from './NumberTrait';

test('Test rounding on instantiation and modification', () => {
	const trait = new NumberTrait<string>({ max: 10, name: 'test', value: 5.2 });
	const trait2 = new NumberTrait<string>({ max: 10, name: 'test', value: 5.8 });
	expect(trait.value).toEqual(5);
  expect( trait2.value ).toEqual( 6 );
  
  trait.value = 0.5
  expect(trait.value).toEqual(1)
});
