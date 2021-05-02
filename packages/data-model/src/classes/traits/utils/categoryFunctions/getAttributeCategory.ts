import { AttributeCategory, AttributeName } from '@quirk-a-bot/common';

export default function getAttributeCategory(
  name: AttributeName
): AttributeCategory {
  const attributeCategories: Record<AttributeName, AttributeCategory> = {
    Strength: "Physical",
    Dexterity: "Physical",
    Stamina: "Physical",
    Charisma: "Social",
    Manipulation: "Social",
    Composure: "Social",
    Intelligence: "Mental",
    Wits: "Mental",
    Resolve: "Mental",
  };

  return attributeCategories[name];

  /*
  switch (name) {
    case "Strength":
    case "Dexterity":
    case "Stamina":
      return "Physical";
    case "Charisma":
    case "Manipulation":
    case "Composure":
      return "Social";
    case "Intelligence":
    case "Wits":
    case "Resolve":
      return "Mental";
    default:
      throw Error(
        `${__filename} ERROR: Unknown attribute name "${name as string}"`
      );
  }
  */
}
