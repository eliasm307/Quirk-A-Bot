export const ATTRIBUTE_NAMES = [
	'Strength',
	'Dexterity',
	'Stamina',
	'Charisma',
	'Manipulation',
	'Composure',
	'Intelligence',
	'Wits',
	'Resolve',
] as const;
export const SKILL_NAMES = ['Athletics', 'Brawl', 'Craft'] as const; // todo add other explicitly specified names
export const DISCIPLINE_NAMES = ['Animalism', 'Auspex', 'Prescence'] as const; // todo add other explicitly specified names
export const ATTRIBUTE_CATEGORIES = ['Physical', 'Social', 'Mental'] as const;
export const CORE_NUMBER_TRAITS = ['Health', 'Willpower', 'Hunger', 'Humanity', 'Blood Potency', 'Sire'] as const;
export const CORE_STRING_TRAITS = ['Name', 'Clan', 'Sire'] as const;
export const TRAIT_TYPES = ['Attribute', 'Skill', 'Discipline', 'Touchstone or Conviction', 'Core'] as const;
