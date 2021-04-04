/**
 * The possible states of a player in a game:
 * - `Pending` - the player has requested to join the game and their request is pending approval from a GM. Nothing other than basic data is saved in the game for this player.
 * - `Active` - the player has been approved to join the game and is Active
 * - `Rejected` - the player's request to join was rejected by a GM. Nothing other than basic data is saved in the game for this player.
 * - `Inactive` - the player left the game willingly, they can rejoin whenever they want. Their character data is saved in the game but hidden.
 * - `Removed` - the player was removed by a GM, they can request to re-join but a GM needs to approve. Their character data is saved in the game but hidden.
 */
export type PlayerStatus = "Pending" | "Active" | "Rejected" | "Inactive";
