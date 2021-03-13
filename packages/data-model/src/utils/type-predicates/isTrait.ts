
/*
export function isBaseTrait(item: any): item is iGeneralTrait {
	if (typeof item !== 'object') return false;

	const { cleanUp, data, log, name, path, value } = item as iGeneralTrait;
	// todo test

	// todo improve this to account for types
  // ? add instanceOf AbstractBaseTrait check? are property checks required also?
	return item instanceof AbstractBaseTrait && !!name && !!value && !!path && !!log && !!data && !!cleanUp;
}
*/
