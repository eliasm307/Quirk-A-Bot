// type unions
export const ATTRIBUTE_NAMES = [
  "Strength",
  "Dexterity",
  "Stamina",
  "Charisma",
  "Manipulation",
  "Composure",
  "Intelligence",
  "Wits",
  "Resolve",
] as const;

export const SKILL_NAMES = [
  "Athletics",
  "Brawl",
  "Craft",
  "Drive",
  "Firearms",
  "Larceny",
  "Melee",
  "Stealth",
  "Survival",
  "Animal Ken",
  "Etiquette",
  "Insight",
  "Intimidation",
  "Leadership",
  "Performance",
  "Persuasion",
  "Streetwise",
  "Subterfuge",
  "Academics",
  "Awareness",
  "Finance",
  "Investigation",
  "Medicine",
  "Occult",
  "Politics",
  "Science",
  "Technology",
] as const;

export const DISCIPLINE_NAMES = [
  "Animalism",
  "Auspex",
  "Prescence",
  "Blood Sorcery",
  "Celerity",
  "Chimerstry",
  "Dementation",
  "Dominate",
  "Fortitude",
  "Necromancy",
  "Obfuscate",
  "Oblivion",
  "Obtenebration",
  "Potence",
  "Protean",
  "Quietus",
  "Serpentis",
  "Thaumaturgy",
  "Thin-Blood Alchemy",
  "Vicissitude",
] as const;

export const ATTRIBUTE_CATEGORIES = ["Physical", "Social", "Mental"] as const;

export const CORE_NUMBER_TRAITS = [
  "Health",
  "Willpower",
  "Hunger",
  "Humanity",
  "Blood Potency",
  "Sire",
] as const;

export const CORE_STRING_TRAITS = ["Name", "Clan", "Sire"] as const;

export const TRAIT_TYPES = [
  "Attribute",
  "Skill",
  "Discipline",
  "Touchstone or Conviction",
  "Core",
] as const;

// todo move these to a firestore constants file?
// values
export const CHARACTER_SHEET_TRAIT_COMPOSITES_COLLECTION_NAME = `traits`;
export const CORE_TRAIT_COLLECTION_NAME = `CoreTraits`;
export const ATTRIBUTE_COLLECTION_NAME = `Attributes`;
export const SKILL_COLLECTION_NAME = `Skills`;
export const DISCIPLINE_COLLECTION_NAME = `Disciplines`;
export const TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME = `TouchstonesAndConvictions`;

export const STRING_TRAIT_DEFAULT_VALUE = "";

export const USER_COLLECTION_NAME = "Users";

export const PLAYER_COLLECTION_NAME = "Players";

export const DEFAULT_USER_NAME = "Nameless Wanderer";
