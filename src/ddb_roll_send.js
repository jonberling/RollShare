/**
 * D&D Beyond content script
 * Loads when a matching D&D Beyond page is opened
 */

 /**
  * Globals
  * @const {string} diceRollNotificationSelector selector for dice roll notification area
  * @const {string} diceRollSelector selector for dice rolls
  * @const {MutationObserver} observeDiceRollNotificationArea monitor a dice roll notification area node
  * @const {MutationObserver} observeBodyForDiceRollNotificationArea monitor a node for new dice roll notification areas
  * @const {Map} abbreviation map of common D&D abbreviations to full word
  */
const diceRollNotificationSelector = "noty_layout__bottomRight";
const diceRollSelector = "div.dice_result";

const observeDiceRollNotificationArea = new MutationObserver(handleDiceRollNotificationAreaMutation);
const observeBodyForDiceRollNotificationArea = new MutationObserver(handleBodyNodeMutation);

const abbreviation = new Map();
abbreviation.set("str", "Strength");
abbreviation.set("dex", "Dexterity");
abbreviation.set("con", "Consitution");
abbreviation.set("int", "Intelligence");
abbreviation.set("wis", "Wisdom");
abbreviation.set("cha", "Charisma");
abbreviation.set("adv", "advantage");
abbreviation.set("dis", "disadvantage");

/**
 * Main method. Entry point for the background service
 */
function main() {
  // start monitoring document body for dice roll notification areas
  observeBodyForDiceRollNotificationArea.observe(document.querySelector('body'), {childList: true});

  console.log("RollShare dndbeyond roll send module loaded")
}

/**
 * Callback when a mutation is detected in the HTML body node
 * @param {MutationRecord} mutationsList
 * @param {MutationObserver} observer
 */
function handleBodyNodeMutation(mutationsList, observer) {
  // loop through all of the mutations
  for (let mutation of mutationsList) {
    // loop through all of the added nodes on this mutation
    for (let node of mutation.addedNodes) {
      // is this a new dice roll notification area?
      if (node.id === diceRollNotificationSelector) {
        // observe the new dice roll notification area for mutations
        observeDiceRollNotificationArea.observe(node, {childList: true});
        found = node.querySelector(diceRollSelector);
        if (found) {
          handleDiceRoll(found);
        }
      }
    }
    // loop through all of the removed nodes on this mutation
    for (let node of mutation.removedNodes) {
      // is this a new dice roll notification area?
      if (node.id === diceRollNotificationSelector) {
        // a dice roll notification area was removed, stop monitoring it
        observeDiceRollNotificationArea.disconnect();
      }
    }
  }
}

/**
 * Callback when a mutation is detected in the HTML dice roll notification node
 * @param {MutationRecord} mutationsList
 * @param {MutationObserver} observer
 */
function handleDiceRollNotificationAreaMutation(mutationsList, observer) {
  // loop through all of the mutations
  for (let mutation of mutationsList) {
    // loop through each of the added nodes
    for (let node of mutation.addedNodes) {
      // search for a new dice roll
      found = node.querySelector(diceRollSelector);
      if (found) {
        // we found a new dice roll, handle it
        handleDiceRoll(found);
      }
    }
  }
}

/**
 * Handle a dice roll
 *
 * Receives a dice roll node, and publishes a message to the background service
 * @param {node} node dice roll document node
 */
function handleDiceRoll(node) {
  rollResult = {
    "detail": node.querySelector(".dice_result__info__rolldetail").textContent.trim().slice(0, -1),
    "type": node.querySelector(".dice_result__rolltype").textContent.trim(),
    "notation": node.querySelector(".dice_result__info__dicenotation").textContent.trim(),
    "breakdown": node.querySelector(".dice_result__info__breakdown").textContent.trim(),
    "result": node.querySelector(".dice_result__total-result").textContent.trim(),
    "advantage": "",
    "critical": "",
    "rolls": []
  };

  // extract rolls (e.g. dice faces)
  rollResult.rolls = rollResult.breakdown.match(/-?\d+/g);
  dIndex = rollResult.notation.indexOf("d");
  numberOfDice = Number(rollResult.notation.substr(0, dIndex));
  if (numberOfDice < 1) { numberOfDice = 1; }
  rollResult.rolls = rollResult.rolls.slice(0, numberOfDice);

  // check for advantage or disadvantage; criticals
  if (rollResult.notation.includes("d20")) {
    if (rollResult.notation.includes("kh1")) { rollResult.advantage = "advantage"; }
    if (rollResult.notation.includes("kl1")) { rollResult.advantage = "disadvantage"; }

    // check for critical success or fail
    roll = Math.max(...rollResult.rolls);
    if (rollResult.advantage === "disadvantage") {
      roll = Math.min(...rollResult.rolls);
    }
    if (roll === 20) { rollResult.critical = "success"; }
    if (roll ===  1) { rollResult.critical = "failure"; }
  }

  // expand abbreviation
  if (abbreviation.has(rollResult.detail)) {
    rollResult.detail = abbreviation.get(rollResult.detail);
  }

  console.log(rollResult);
  chrome.runtime.sendMessage(rollResult);
}

/**
 * Bootstrap
 */
main();
