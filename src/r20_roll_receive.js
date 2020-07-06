/**
 * Roll20 content script
 * Loads when a matching roll20 page is opened
 */

/**
 * Globals
 * @const {node} text_input chat messages go here
 * @const {node} send_button  publishes text input field on Roll20 when clicked
 */
const text_input = document.querySelector("#textchat-input > textarea");
const send_button = document.querySelector("#textchat-input > button");

/**
 * Main method. Entry point for the background service
 */
function main() {
  // register a message listener
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log(request);
      handleMessage(request);
    }
  );

  console.log("RollShare roll20 roll receive module loaded")
}

/**
 * Handle incoming message
 *
 * Handles incoming message and updates Roll20
 * @param {Object} message
 */
function handleMessage(message) {
  // Assume all incoming messages are dice rolls
  console.log(message);
  switch (message.detail) {
    case "custom":
      publishCustomRoll(message.result, message.notation, message.breakdown, message.critical);
      break;
    case "Initiative":
      publishInitiativeRoll(message.result, message.notation, message.breakdown, message.critical);
      break;
    default:
      publishRoll(message.detail, message.type, message.result, message.notation, message.breakdown, message.critical);
  }
}

/**
 * Create a Roll20 roll string using [[]] notation
 * @param {(string|number)} result roll result, including all dice rolls and bonuses
 * @param {string} notation e.g. 1d20+3
 * @param {string} breakdown breakdown of all rolls and bonuses. e.g. 17+2
 * @param {string} [tag] optional roll20 tag
 */
function createRollString(result, notation, breakdown, tag = "") {
  return `[[ ${result} [${notation}] = ${breakdown} ${tag}]] = ${breakdown}`;
}

/**
 * Create a Roll20 critical message
 * @param {string} critical success, failure, or empty string
 */
function createCritString(critical) {
  if (critical) {
    switch (critical) {
      case "success": return "{{=Natural 20}}";
      case "failure": return "{{=Natural 1}}"
      default: return "";
    }
  }
}

/**
 * Publish a custom roll on Roll20
 * @param {(string|number)} result roll result, including all dice rolls and bonuses
 * @param {string} notation e.g. 1d20+3
 * @param {string} breakdown breakdown of all rolls and bonuses. e.g. 17+2
 * @param {string} critical string containing critical success/failure information
 */
function publishCustomRoll(result, notation, breakdown, critical) {
  const critString = createCritString(critical);
  const rollString = createRollString(result, notation, breakdown);

  const roll_template = `&{template:default} {{name=Rolling ${notation}}} {{Roll=${rollString}}} ${critString}`
  clickButton(roll_template);
}

/**
 * Publish an initiative roll to Roll20
 * @param {(string|number)} result roll result, including all dice rolls and bonuses
 * @param {string} notation e.g. 1d20+3
 * @param {string} breakdown breakdown of all rolls and bonuses. e.g. 17+2
 * @param {string} critical string containing critical success/failure information
 */
function publishInitiativeRoll(result, notation, breakdown, critical) {
  const critString = createCritString(critical);
  const rollString = createRollString(result, notation, breakdown, "&{tracker}");

  const roll_template = `&{template:default} {{name=Initiative}} {{Roll=${rollString}}} ${critString}`
  clickButton(roll_template);
}

/**
 * Publish a roll to Roll20
 * @param {string} name
 * @param {string} type
 * @param {(string|number)} result roll result, including all dice rolls and bonuses
 * @param {string} notation e.g. 1d20+3
 * @param {string} breakdown breakdown of all rolls and bonuses. e.g. 17+2
 * @param {string} critical string containing critical success/failure information
 */
function publishRoll(name, type, result, notation, breakdown, critical) {
  const critString = createCritString(critical);
  const rollString = createRollString(result, notation, breakdown);

  const roll_template = `&{template:default} {{name=${name}: ${type}}} {{Roll=${rollString}}} ${critString}`
  clickButton(roll_template);
}

/**
 * Populate the text area on Roll20, and click the send button
 * @param {string} message chat message - includes things like dice rolls
 */
function clickButton(message) {
  text_input.value = message;
  send_button.click();
}

/**
 * Bootstrap
 */
main();
