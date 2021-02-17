import regexToDice from '../../utils/regexToDice.js';
import doTheRolling from '../../utils/doTheRolling.js';
import rollRouse from '../../utils/rollRouse.js';
import { DICE_ROLL_REGEX, ROUSE_REGEX } from '../../constants.js';

/**
 * Parses non-bot messages in Dice Rolling channel
 * @param {Object} msg Discord message object
 */
export default function handleDiceRollingChannelMessage(msg) {
	let regexMatch;

	// handle dice roll
	regexMatch = msg.content.match(DICE_ROLL_REGEX);
	console.log({ regexMatch });
	if (regexMatch) {
		// Add in a roll 3d10 style roller (with multi support "roll 3d4, 2d6")
		const playerDice = regexToDice(regexMatch);
		return msg.reply(doTheRolling(playerDice));
	}

	// handle player asked to rouse the blood.
	regexMatch = msg.content.match(ROUSE_REGEX);
	if (regexMatch) {
		const rouseDice = parseInt(regexMatch[1]) || 1;
		return msg.reply(rollRouse(rouseDice));
	}
}
