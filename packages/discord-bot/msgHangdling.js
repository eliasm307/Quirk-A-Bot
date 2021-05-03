// Or create a gotMessageModules = [Module1,Module3,...] containing only the modules that have a gotMessage function then run a loop over these.
// Optimised further: create a map, that links channel id's to an array of functions, then on recipt of the message, runs through the appropriate array.
// Note this also leaves room for a "Global" array that doesn't care what channle it comes from.
// This approach also allows things other than the channel_id to be the desiding factor in wheither a message is parsed or not.
// (noteworthy that if multiple things are checked then run against, there should be a safeguard against "double responding")
// Also this would allow a sheild against the bot responding to it's own messages at any point

function gotMessage(msg) {
  // if ("message sent by Quirk-A-bot") {return}
  Module1.gotMessage(msg);
  Module2.gotMessage(msg);
  // ...
}
