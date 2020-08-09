
const _diceRollSelector = "div.dice_result";
const _diceRollNotificationSelector = "noty_layout__bottomRight";

/**
 * D&D Beyond Observer
 *
 * Observes the D&D Beyond page and sends updates to the background service
 */
class DndBeyondObserver {
  constructor(parser) {
    this.observeDiceRollNotificationArea = new MutationObserver(this._handleDiceRollNotificationNodeMutation.bind(this));
    this.observeBodyForDiceRollNotificationArea = new MutationObserver(this._handleBodyNodeMutation.bind(this));

    this.parser = parser;

    console.log("RollShare dndbeyond observer loaded");
  }

  /**
   * Start the observer
   */
  start() {
    this.observeBodyForDiceRollNotificationArea.observe(document.querySelector('body'), {childList: true});
    console.log("RollShare dndbeyond observer started");
  }

  /**
   * Populate a RollResult object
   * @param {String} detail
   * @param {String} type
   * @param {String} notation
   * @param {String} breakdown
   * @param {Number} total
   *
   * @return {RollResult} The roll result
   */
  populateRollResult(detail, type, notation, breakdown, total) {
    const rollResult = new RollResult();

    rollResult.detail = detail;
    rollResult.type = type;
    rollResult.notation = notation;
    rollResult.breakdown = breakdown;
    rollResult.total = total;

    // extract die_faces
    const breakdown_matches = rollResult.breakdown.match(/-?\d+/g);
    if (breakdown_matches) {
      const breakdown_elements = breakdown_matches.map(Number);
      const dIndex = rollResult.notation.indexOf("d");
      let numberOfDice = Number(rollResult.notation.substring(0, dIndex));
      if (numberOfDice < 1) { numberOfDice = 1; }
      rollResult.die_faces = breakdown_elements.slice(0, numberOfDice);
    }

    // extract bonus
    const notation_contains_bonus = Math.max(rollResult.notation.indexOf('+'), rollResult.notation.indexOf('-'));
    if (notation_contains_bonus >= 0) {
      rollResult.bonus = Number(rollResult.notation.substring(notation_contains_bonus));
    }

    // check for advantage or disadvantage; criticals
    if (rollResult.notation.includes("d20")) {
      if (rollResult.notation.includes("kh1")) { rollResult.advantage = AdvantageTag.advantage; }
      if (rollResult.notation.includes("kl1")) { rollResult.advantage = AdvantageTag.disadvantage; }

      // check for critical success or fail
      let roll = Math.max(...rollResult.die_faces);
      if (rollResult.advantage === "disadvantage") {
        roll = Math.min(...rollResult.die_faces);
      }
      if (roll === 20) { rollResult.critical_tag = CriticalTag.natural20; }
      if (roll ===  1) { rollResult.critical_tag = CriticalTag.natural1; }
    }

    // expand abbreviation
    rollResult.detail = abbreviationToWord(rollResult.detail);

    return rollResult;
  }

  /**
   * Publish a message to the background service
   * @param {Object} message
   */
  publishMessage(message) {
    chrome.runtime.sendMessage(message);
  }

  /**
   * Callback when a mutation is detected in the HTML dice roll notification node
   * @param {MutationRecord} mutationsList
   * @param {MutationObserver} observer
   */
  _handleDiceRollNotificationNodeMutation(mutationsList, observer) {
    // loop through all of the mutations
    for (let mutation of mutationsList) {
      // loop through each of the added nodes
      for (let node of mutation.addedNodes) {
        // search for a new dice roll
        const found = node.querySelector(_diceRollSelector);
        if (found) {
          // we found a new dice roll, handle it
          this._handleDiceRoll(found);
        }
      }
    }
  }

  /**
   * Callback when a mutation is detected in the HTML body node
   * @param {MutationRecord} mutationsList
   * @param {MutationObserver} observer
   */
  _handleBodyNodeMutation(mutationsList, observer) {
    // loop through all of the mutations
    for (let mutation of mutationsList) {
      // loop through all of the added nodes on this mutation
      for (let node of mutation.addedNodes) {
        // is this a new dice roll notification area?
        if (node.id === _diceRollNotificationSelector) {
          // observe the new dice roll notification area for mutations
          this.observeDiceRollNotificationArea.observe(node, {childList: true});
          const found = node.querySelector(_diceRollSelector);
          if (found) {
            this._handleDiceRoll(found);
          }
        }
      }
      // loop through all of the removed nodes on this mutation
      for (let node of mutation.removedNodes) {
        // is this a new dice roll notification area?
        if (node.id === _diceRollNotificationSelector) {
          // a dice roll notification area was removed, stop monitoring it
          this.observeDiceRollNotificationArea.disconnect();
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
  _handleDiceRoll(node) {
    const rollResult = this.populateRollResult(
      this.parser.detail(node),
      this.parser.type(node),
      this.parser.notation(node),
      this.parser.breakdown(node),
      this.parser.total(node)
    );

    this.publishMessage(rollResult);
  }
}

class DndBeyondRollParser {
  detail(node) {
    return node.querySelector(".dice_result__info__rolldetail").textContent.trim().slice(0, -1);
  }

  type(node) {
    return node.querySelector(".dice_result__rolltype").textContent.trim();
  }

  notation(node) {
    return node.querySelector(".dice_result__info__dicenotation").textContent.trim();
  }

  breakdown(node) {
    return node.querySelector(".dice_result__info__breakdown").textContent.trim();
  }

  total(node) {
    return parseInt(node.querySelector(".dice_result__total-result").textContent.trim());
  }
}
