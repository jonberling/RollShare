/**
 * Background service. Loads when one or more content script is active.
 */

/**
 * Main method. Entry point for the background service
 */
function main() {
  // register a message listener
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleIncomingMessage(request);
  });

  console.log("RollShare background module loaded")
}

/**
 * Handles incoming messages from content scripts, and forwards them to other
 * content scripts as approprate.
 * @param {Object} message
 */
function handleIncomingMessage(message) {
  console.log("processing message");
  console.log(message);

  // for now, assume every message is a D&D Beyond dice roll, and forward it to
  // roll20
  chrome.tabs.query({ "url": "*://app.roll20.net/editor/*" }, function (tabs) {
    for (let tab of tabs) {
      chrome.tabs.sendMessage(tab.id, message);
    }
  });
}

/**
 * Bootstrap
 */
main();
