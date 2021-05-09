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

// todo check spelling
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

// todo double check spellings
export const DISCIPLINE_NAMES = [
  "Animalism",
  "Auspex",
  "Prescence",
  "Blood Sorcery",
  "Celerity",
  "Chemistry",
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

export const CORE_NUMBER_TRAIT_NAMES = [
  "Health",
  "Willpower",
  "Hunger",
  "Humanity",
  "Blood Potency",
] as const;

export const CORE_STRING_TRAIT_NAMES = ["Name", "Clan", "Sire"] as const;

export const TRAIT_TYPES = [
  "Attribute",
  "Skill",
  "Discipline",
  "Touchstone or Conviction",
  "Core",
] as const;

// todo move these to a firestore constants file?

// collection names
export const CHARACTER_SHEET_TRAIT_COMPOSITE_DOCUMENT_COLLECTION_NAME = `character-sheet-traits`;
export const CORE_TRAIT_COLLECTION_NAME = `core-traits`;
export const ATTRIBUTE_COLLECTION_NAME = `attributes`;
export const SKILL_COLLECTION_NAME = `skills`;
export const DISCIPLINE_COLLECTION_NAME = `disciplines`;
export const TOUCHSTONE_AND_CONVICTION_COLLECTION_NAME = `touchstones-and-convictions`;
export const USER_COLLECTION_NAME = "users";
export const PLAYER_COLLECTION_NAME = "players";
export const CHARACTER_COLLECTION_NAME = "characters";

// values
export const STRING_TRAIT_DEFAULT_VALUE = "";
export const DEFAULT_USER_NAME = "Nameless Wanderer";
export const DEFAULT_CHARACTER_NAME = "Nameless Undead";
export const DEFAULT_CHARACTER_IMAGE_URL =
  "https://www.flaticon.com/svg/vstatic/svg/3504/3504404.svg?token=exp=1620587740~hmac=701e673f405dbcc957d4629d2d6264ad"; // todo add attribution
