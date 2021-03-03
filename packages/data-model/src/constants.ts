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
export const SKILL_NAMES = [
	'Athletics',
	'Brawl',
	'Craft',
	'Drive',
	'Firearms',
	'Larceny',
	'Melee',
	'Stealth',
	'Survival',
	'Animal Ken',
	'Etiquette',
	'Insight',
	'Intimidation',
	'Leadership',
	'Performance',
	'Persuasion',
	'Streetwise',
	'Subterfuge',
	'Academics',
	'Awareness',
	'Finance',
	'Investigation',
	'Medicine',
	'Occult',
	'Politics',
	'Science',
	'Technology',
] as const;  
export const DISCIPLINE_NAMES = ['Animalism', 'Auspex', 'Prescence'] as const; // todo add other explicitly specified names
export const ATTRIBUTE_CATEGORIES = ['Physical', 'Social', 'Mental'] as const;
export const CORE_NUMBER_TRAITS = ['Health', 'Willpower', 'Hunger', 'Humanity', 'Blood Potency', 'Sire'] as const;
export const CORE_STRING_TRAITS = ['Name', 'Clan', 'Sire'] as const;
export const TRAIT_TYPES = ['Attribute', 'Skill', 'Discipline', 'Touchstone or Conviction', 'Core'] as const;
