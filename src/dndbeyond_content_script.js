/**
 * dndbeyond.com content script
 */

// create a dndbeyond observer and start it
dndBeyondRollParser = new DndBeyondRollParser();
dndBeyondObserver = new DndBeyondObserver(dndBeyondRollParser);
dndBeyondObserver.start();
